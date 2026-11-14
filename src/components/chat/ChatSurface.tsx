import { useEffect, useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '~/api'
import { queryKeys } from '~/api/query-keys'
import { messageThreadsQueryOptions, threadMessagesQueryOptions } from '~/api/queries'
import { type MessageAuthorRole } from '~/api/types'
import { useStrings } from '~/shell/useStrings'

/**
 * In-app chat surface — shared by the header messages popup and the parent
 * Messages screen. Mock only: the conversation list, the messages of the
 * selected conversation, an input and a deterministic mock reply, all through
 * the adapter (`messages.*`, every method PROPOSED). No real-time transport and
 * no notifications. The parent sees the Teacher and the Teacher Assistant.
 */

export function ChatSurface({ active }: { active: boolean }) {
  const strings = useStrings()
  const queryClient = useQueryClient()
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLUListElement>(null)

  const threadsQuery = useQuery({ ...messageThreadsQueryOptions(), enabled: active })
  const threads = threadsQuery.data ?? []

  const activeThread =
    threads.find((thread) => thread.id === activeThreadId) ?? threads[0] ?? null
  const activeId = activeThread?.id ?? null

  const messagesQuery = useQuery({
    ...threadMessagesQueryOptions(activeId ?? ''),
    enabled: active && activeId !== null,
  })
  const messages = messagesQuery.data ?? []

  const sendMutation = useMutation({
    mutationFn: (body: string) =>
      api.messages.sendMessage({ threadId: activeId ?? '', body }),
    onSuccess: () => {
      setDraft('')
      if (activeId) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.messages.thread(activeId),
        })
      }
      void queryClient.invalidateQueries({
        queryKey: queryKeys.messages.threads(),
      })
    },
  })

  // Keep the newest message in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length, active, activeId])

  const roleLabel = (role: MessageAuthorRole) => strings.chat.roleNames[role]
  const canSend =
    draft.trim().length > 0 && !sendMutation.isPending && activeId !== null

  return (
    <div className="chat-surface">
      <div className="chat-surface__threads">
        <h3 className="chat-surface__section-title">
          {strings.chat.threadsLabel}
        </h3>
        {threadsQuery.isPending ? (
          <p className="loading-note" role="status">
            {strings.chat.loading}
          </p>
        ) : threadsQuery.isError ? (
          <p className="chat-surface__error">{strings.chat.loadError}</p>
        ) : threads.length === 0 ? (
          <p className="chat-surface__muted">{strings.chat.noThreads}</p>
        ) : (
          <ul className="chat-surface__thread-list">
            {threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  className={`chat-thread${
                    thread.id === activeId ? ' is-active' : ''
                  }`}
                  onClick={() => setActiveThreadId(thread.id)}
                  aria-current={thread.id === activeId ? 'true' : undefined}
                >
                  <span className="chat-thread__name">
                    <bdi>{thread.title}</bdi>
                  </span>
                  <span className="chat-thread__role">
                    <bdi>{roleLabel(thread.participant.role)}</bdi>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="chat-surface__conversation">
        {activeThread === null ? (
          <p className="chat-surface__muted">{strings.chat.selectThread}</p>
        ) : messagesQuery.isPending ? (
          <p className="loading-note" role="status">
            {strings.chat.messagesLoading}
          </p>
        ) : messagesQuery.isError ? (
          <p className="chat-surface__error">{strings.chat.messagesError}</p>
        ) : messages.length === 0 ? (
          <p className="chat-surface__muted">{strings.chat.empty}</p>
        ) : (
          <ul className="chat-surface__messages" ref={listRef}>
            {messages.map((message) => (
              <li
                key={message.id}
                className={`chat-message${
                  message.fromMe ? ' chat-message--me' : ''
                }`}
              >
                <span className="chat-message__author">
                  <bdi>
                    {message.fromMe
                      ? strings.chat.youLabel
                      : message.author.name || roleLabel(message.author.role)}
                  </bdi>
                </span>
                <p className="chat-message__body" dir="auto">
                  {message.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        className="chat-surface__composer"
        onSubmit={(event) => {
          event.preventDefault()
          if (canSend) sendMutation.mutate(draft.trim())
        }}
      >
        <label className="visually-hidden" htmlFor="chat-surface-input">
          {strings.chat.inputLabel}
        </label>
        <input
          id="chat-surface-input"
          className="chat-surface__input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={strings.chat.placeholder}
          disabled={activeId === null}
          autoComplete="off"
        />
        <button type="submit" className="chat-surface__send" disabled={!canSend}>
          {sendMutation.isPending ? strings.chat.sending : strings.chat.send}
        </button>
      </form>
      {sendMutation.isError ? (
        <p className="chat-surface__error" role="alert">
          {strings.chat.sendError}
        </p>
      ) : null}
    </div>
  )
}
