import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { sessionQueryOptions } from '~/api/queries'
import { MohsenAskDialog } from '~/components/mohsen/MohsenAskDialog'
import { useStrings } from '~/shell/useStrings'

/**
 * Floating "ask Mohsen" circle — present on every screen once a session
 * exists, for every role. It opens the global grounded popup
 * (`mohsen.ask`); it is not a chat transport and does not survive a reload.
 */
export function MohsenFab() {
  const strings = useStrings().mohsenAsk
  const [open, setOpen] = useState(false)
  const sessionQuery = useQuery(sessionQueryOptions())
  const user = sessionQuery.data?.user ?? null

  if (!user) return null

  return (
    <>
      <button
        type="button"
        className="mohsen-fab"
        onClick={() => setOpen(true)}
        aria-label={strings.openLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        title={strings.fabLabel}
      >
        <img
          className="mohsen-fab__mascot"
          src="/brand/mohsen-fab.png"
          alt=""
          width={52}
          height={52}
          decoding="async"
        />
      </button>
      <MohsenAskDialog
        open={open}
        onClose={() => setOpen(false)}
        userId={user.id}
      />
    </>
  )
}
