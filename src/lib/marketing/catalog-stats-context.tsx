"use client"

/**
 * Lets client marketing components read the server-resolved catalog stats
 * without threading props through every intermediate layout component. Each
 * marketing page resolves `getCatalogStats()` on the server and wraps its
 * client subtree in `<CatalogStatsProvider>`; leaf components call
 * `useCatalogStats()`.
 *
 * Falls back to DEFAULT_CATALOG_STATS when no provider is present so a
 * component rendered outside a marketing page still has truthful numbers.
 */
import { createContext, useContext } from "react"
import { DEFAULT_CATALOG_STATS, type CatalogStats } from "./catalog-stats"

const CatalogStatsContext = createContext<CatalogStats>(DEFAULT_CATALOG_STATS)

export function CatalogStatsProvider({
  value,
  children,
}: {
  value: CatalogStats
  children: React.ReactNode
}) {
  return (
    <CatalogStatsContext.Provider value={value}>
      {children}
    </CatalogStatsContext.Provider>
  )
}

export function useCatalogStats(): CatalogStats {
  return useContext(CatalogStatsContext)
}
