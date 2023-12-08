import type { BoardSettings } from '../types/board-settings'

export interface CreateGameRequestDto {
  readonly cols: number
  readonly rows: number
  readonly mines: number
}

export interface CreateGameResponseDto {
  data: {
    id: string
    settings: BoardSettings
    gameOver: boolean
  }
}
