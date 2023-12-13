import type { GameState } from '../enums/game-state'
import type { BoardSettings } from '../types/board-settings'
import type { GameDifficulty } from '../enums/game-difficulty'

export type CreateGameDto =
  | {
    difficulty:
      | GameDifficulty.BEGINNER
      | GameDifficulty.INTERMEDIATE
      | GameDifficulty.EXPERT
  }
  | {
    difficulty: GameDifficulty.CUSTOM
    readonly rows: number
    readonly cols: number
    readonly mines: number
  }

export interface CreateGameResponseDto {
  data: {
    id: string
    settings: BoardSettings
    state: GameState
  }
}
