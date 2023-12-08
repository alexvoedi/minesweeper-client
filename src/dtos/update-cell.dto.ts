import type { CellAction } from '../enums/cell-action'
import type { Cell } from '../types/cell'

export interface UpdateCellRequestDto {
  readonly x: number
  readonly y: number
  readonly action: CellAction
}

export interface UpdateCellResponseDto {
  data: {
    gameOver: boolean
    cells: Cell[]
  }
}
