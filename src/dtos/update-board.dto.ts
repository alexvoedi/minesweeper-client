import type { BoardSettings } from '../types/board-settings'
import type { Cell } from '../types/cell'

export interface UpdateBoardResponseDto {
  data: {
    cells: Cell[]
    settings: BoardSettings
  }
}
