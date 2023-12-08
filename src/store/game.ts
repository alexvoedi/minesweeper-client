import ky from 'ky'
import { defineStore } from 'pinia'
import type { UpdateBoardResponseDto } from '../dtos/update-board.dto'
import type { Cell } from '../types/cell'
import type { BoardSettings } from '../types/board-settings'
import type { UpdateCellRequestDto, UpdateCellResponseDto } from '@/dtos/update-cell.dto'
import type { CreateGameRequestDto, CreateGameResponseDto } from '@/dtos/create-game.dto'
import type { Xy } from '@/types/xy'

const BASE_URL = 'http://192.168.0.2:3000'

interface GameStore {
  cellSize: Ref<number>
  gameId: string
  settings: BoardSettings
  cells: Cell[]
  gameOver: boolean
}

export const useGameStore = defineStore('game-store', {
  state: (): GameStore => ({
    cellSize: useStorage('cell-size', 32),
    gameId: '',
    settings: {
      cols: 10,
      rows: 10,
      mines: 10,
    },
    cells: [],
    gameOver: false,
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

        this.gameId = data.id
        this.settings = data.settings
        this.gameOver = data.gameOver
      }
      catch (error) {

      }
    },

    async updateBoard() {
      const url = new URL(`/games/${this.gameId}/boards/`, BASE_URL)

      try {
        const { data } = await ky.get(url).json<UpdateBoardResponseDto>()

        this.cells = data.cells
      }
      catch (error) {
        console.error(error)
      }
    },

    async updateCell(dto: UpdateCellRequestDto) {
      const url = new URL(`/games/${this.gameId}/cells/`, BASE_URL)

      try {
        const { data } = await ky.patch(url, {
          json: dto,
        }).json<UpdateCellResponseDto>()

        if (data.gameOver) {
          this.gameOver = true
        }
        else {
          data.cells.forEach((cell) => {
            const boardCellIndex = this.getCellIndex([cell.x, cell.y])

            this.cells[boardCellIndex] = cell
          })
        }
      }
      catch (error) {
        console.error(error)
      }
    },

  },

  getters: {},
})
