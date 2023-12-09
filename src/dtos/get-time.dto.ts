import type { GameState } from '../enums/game-state'
import type { Time } from '../types/time'

export interface GetGameResponse {
  data: {
    id: string
    state: GameState
    time: Time
  }
}
