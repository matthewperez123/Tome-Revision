declare module "react-simple-maps" {
  import { ComponentType, CSSProperties, ReactNode } from "react"

  export interface ProjectionConfig {
    scale?: number
    center?: [number, number]
    rotate?: [number, number, number]
    parallels?: [number, number]
  }

  export interface ComposableMapProps {
    projection?: string
    projectionConfig?: ProjectionConfig
    width?: number
    height?: number
    className?: string
    style?: CSSProperties
    children?: ReactNode
  }

  export interface ZoomableGroupProps {
    center?: [number, number]
    zoom?: number
    minZoom?: number
    maxZoom?: number
    translateExtent?: [[number, number], [number, number]]
    onMoveStart?: (event: unknown, position: unknown) => void
    onMove?: (event: unknown, position: unknown) => void
    onMoveEnd?: (event: unknown, position: unknown) => void
    className?: string
    children?: ReactNode
  }

  export interface GeographyStyleObject {
    fill?: string
    stroke?: string
    strokeWidth?: number
    cursor?: string
    outline?: string
    transition?: string
  }

  export interface GeographyStyle {
    default?: GeographyStyleObject
    hover?: GeographyStyleObject
    pressed?: GeographyStyleObject
  }

  export interface GeographyProps {
    geography: {
      rsmKey: string
      properties: Record<string, unknown>
      type: string
      geometry: unknown
    }
    style?: GeographyStyle
    className?: string
    onMouseEnter?: (event: React.MouseEvent) => void
    onMouseLeave?: (event: React.MouseEvent) => void
    onClick?: (event: React.MouseEvent) => void
    onMouseDown?: (event: React.MouseEvent) => void
    onMouseUp?: (event: React.MouseEvent) => void
    onFocus?: (event: React.FocusEvent) => void
    onBlur?: (event: React.FocusEvent) => void
  }

  interface GeoObject {
    rsmKey: string
    properties: Record<string, unknown>
    type: string
    geometry: unknown
  }

  export interface GeographiesProps {
    geography: string | Record<string, unknown>
    children: (data: { geographies: GeoObject[] }) => ReactNode
    parseGeographies?: (geos: unknown[]) => unknown[]
  }

  export const ComposableMap: ComponentType<ComposableMapProps>
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>
  export const Geographies: ComponentType<GeographiesProps>
  export const Geography: ComponentType<GeographyProps>
}
