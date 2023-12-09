import type { GameState } from '../enums/game-state'
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
    state: GameState
  }
}
