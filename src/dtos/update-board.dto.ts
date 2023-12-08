import type { Cell } from '../types/cell'

export interface UpdateBoardResponseDto {
  data: {
    cells: Cell[]
  }
}
