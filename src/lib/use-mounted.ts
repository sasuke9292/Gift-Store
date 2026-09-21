import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}

/**
 * Hook to check if the component is mounted on the client.
 * Uses useSyncExternalStore for hydration-safe rendering without triggering
 * React 19 cascading render lint warnings.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}
