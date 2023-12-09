import ky from 'ky'
import { defineStore } from 'pinia'
import type { UpdateBoardResponseDto } from '../dtos/update-board.dto'
import type { Cell } from '../types/cell'
import type { BoardSettings } from '../types/board-settings'
import { GameState } from '../enums/game-state'
import type { GetGameResponse } from '../dtos/get-time.dto'
import type { Time } from '../types/time'
import type { UpdateCellRequestDto, UpdateCellResponseDto } from '@/dtos/update-cell.dto'
import type { CreateGameRequestDto, CreateGameResponseDto } from '@/dtos/create-game.dto'
import type { Xy } from '@/types/xy'

const BASE_URL = 'http://192.168.0.2:3000'

interface GameStore {
  cellSize: Ref<number>
  id: string
  settings: BoardSettings
  cells: Cell[]
  state: GameState
  time: Time
}

export const useGameStore = defineStore('game-store', {
  state: (): GameStore => ({
    cellSize: useStorage('cell-size', 32),
    id: '',
    settings: {
      cols: 10,
      rows: 10,
      mines: 10,
    },
    cells: [],
    state: GameState.WAITING,
    time: {
      start: 0,
    },
  }),

  actions: {
    isInBounds([x, y]: Xy) {
      return x >= 0 && x < this.settings.cols && y >= 0 && y < this.settings.rows
    },

    getCell([x, y]: Xy) {
      const cell = this.cells.find(boardCell => boardCell.x === x && boardCell.y === y)

      if (!cell)
        throw new Error(`Cell not found: (${x}/${y})`)

      return cell
    },

    getCellIndex([x, y]: Xy) {
      const cellIndex = this.cells.findIndex(boardCell => boardCell.x === x && boardCell.y === y)

      if (cellIndex < 0)
        throw new Error(`Cell not found: (${x}/${y})`)

      return cellIndex
    },

    async createGame(dto: CreateGameRequestDto) {
      const url = new URL('/games/', BASE_URL)

      try {
        const { data } = await ky.put(url, {
          json: dto,
        }).json<CreateGameResponseDto>()

        Object.assign(this, data)

        this.time = {
          start: 0,
        }
      }
      catch (error) {
        console.error(error)
      }
    },

    async updateGame() {
      const url = new URL(`/games/${this.id}/`, BASE_URL)

      try {
        const { data } = await ky.get(url).json<GetGameResponse>()

        Object.assign(this, data)
      }
      catch (error) {
        console.error(error)
      }
    },

    async updateBoard() {
      const url = new URL(`/games/${this.id}/boards/`, BASE_URL)

      try {
        const { data } = await ky.get(url).json<UpdateBoardResponseDto>()

        Object.assign(this, data)
      }
      catch (error) {
        console.error(error)
      }
    },

    async updateCell(dto: UpdateCellRequestDto) {
      const url = new URL(`/games/${this.id}/cells/`, BASE_URL)

      try {
        const { data } = await ky.patch(url, {
          json: dto,
        }).json<UpdateCellResponseDto>()

        data.cells.forEach((cell) => {
          const boardCellIndex = this.getCellIndex([cell.x, cell.y])

          this.cells[boardCellIndex] = cell
        })

        this.state = data.state
      }
      catch (error) {
        console.error(error)
      }
    },

  },

  getters: {},
})
