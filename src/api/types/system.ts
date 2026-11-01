import type { ApiMode, ContractStatus } from './common'

/**
 * Adapter-local diagnostics. This is NOT a Mentingo endpoint.
 * It exists so the app can show which adapter/config is active in a demo.
 */
export interface AdapterInfo {
  contractVersion: string
  mode: ApiMode
  mockScenario: 'seeded' | 'empty' | null
  /** Every API shape in this build is a proposal, never a confirmed Mentingo API. */
  endpointStatus: ContractStatus
}
