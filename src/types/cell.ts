import type { CellState } from '../enums/cell-state'

export interface Cell {
  x: number
  y: number
  state: CellState
  adjacentMines?: number
  mine?: boolean
  highlight?: boolean
}
