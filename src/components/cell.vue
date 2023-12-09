<script setup lang="ts">
import { CellAction } from '../enums/cell-action'
import { CellState } from '../enums/cell-state'
import { GameState } from '../enums/game-state'
import { useGameStore } from '../store/game'
import type { Cell } from '../types/cell'
import type { Xy } from '../types/xy'

defineProps<{
  cell: Cell
}>()

const emit = defineEmits<{
  (e: 'setAdjacentCellHighlight', value: {
    x: number
    y: number
    highlight: boolean
  }): void
}>()

const gameStore = useGameStore()

async function updateCell(cell: Cell, action: CellAction) {
  if (gameStore.state === GameState.WIN || gameStore.state === GameState.LOSE)
    return

  if (cell.state === CellState.FLAGGED && action === CellAction.OPEN)
    return

  if (action === CellAction.OPEN_ADJACENT) {
    emit('setAdjacentCellHighlight', {
      x: cell.x,
      y: cell.y,
      highlight: false,
    })
  }

  await gameStore.updateCell({
    x: cell.x,
    y: cell.y,
    action,
  })

  await gameStore.updateGame()
}

async function toggleCellState(cell: Cell) {
  switch (cell.state) {
    case CellState.CLOSED: {
      return await updateCell(cell, CellAction.FLAG)
    }
    case CellState.FLAGGED: {
      return await updateCell(cell, CellAction.MARK)
    }
    case CellState.MARKED: {
      return await updateCell(cell, CellAction.CLEAR)
    }
  }
}

function highlightAdjacentCells([x, y]: Xy) {
  emit('setAdjacentCellHighlight', {
    x,
    y,
    highlight: true,
  })
}

const gameEnded = computed(() => gameStore.state === GameState.WIN || gameStore.state === GameState.LOSE)
</script>

<template>
  <button
    :disable="gameEnded" class="border-1 border-gray-300 flex items-center justify-center font-mono"
    :class="[
      {
        'bg-gray-500': cell.state !== CellState.OPENED,
        'bg-gray-200': cell.state === CellState.OPENED,
        'bg-gray-600': cell.highlight,
        'cursor-auto pointer-events-none': gameEnded,
        'hover:(bg-gray-400) active:(bg-gray-600)': cell.state !== CellState.OPENED && gameEnded,
        'cursor-auto': cell.state === CellState.OPENED && !cell.adjacentMines && gameEnded,
      },
    ]"
    :style="{
      width: `${gameStore.cellSize}px`,
      height: `${gameStore.cellSize}px`,
      fontSize: `${gameStore.cellSize / 1.5}px`,
    }"
    @mousedown.left.prevent="() => {
      if (cell.state === CellState.OPENED && cell.adjacentMines) {
        highlightAdjacentCells([cell.x, cell.y])
      }
    }"
    @mouseup.left.prevent="() => {
      if (cell.state === CellState.OPENED && cell.adjacentMines) {
        updateCell(cell, CellAction.OPEN_ADJACENT)
      }
      else if (cell.state === CellState.CLOSED) {
        updateCell(cell, CellAction.OPEN)
      }
    }"
    @contextmenu.prevent="toggleCellState(cell)"
    @mousedown.middle.prevent="() => {
      if (cell.state === CellState.OPENED && cell.adjacentMines) {
        highlightAdjacentCells([cell.x, cell.y])
      }
    }"
    @mouseup.middle.prevent="() => {
      if (cell.state === CellState.OPENED && cell.adjacentMines) {
        updateCell(cell, CellAction.OPEN_ADJACENT)
      }
    }"
  >
    <span v-if="cell.mine" class="ico-mdi-bomb text-red-600" />
    <span v-else-if="cell.state === CellState.FLAGGED" class="ico-mdi-flag text-red-600" />
    <span v-else-if="cell.state === CellState.MARKED" class="text-gray-200 font-bold">?</span>
    <span
      v-else-if="cell.state === CellState.OPENED && cell.adjacentMines && cell.adjacentMines > 0" :class="{
        'color-red-600': 7 <= cell.adjacentMines && cell.adjacentMines <= 9,
        'color-yellow-600': 4 <= cell.adjacentMines && cell.adjacentMines <= 6,
        'color-blue-600': 1 <= cell.adjacentMines && cell.adjacentMines <= 3,
      }" class="font-bold pointer-events-none"
    >
      {{ cell.adjacentMines }}
    </span>
  </button>
</template>
