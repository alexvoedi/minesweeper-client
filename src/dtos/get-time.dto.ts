import type { GameState } from '../enums/game-state'
import type { Cell } from '../types/cell'
import type { Time } from '../types/time'

export interface GetGameResponse {
  data: {
    id: string
    state: GameState
    time: Time
    cells: Cell[]
  }
}
