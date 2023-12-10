<script setup lang="ts">
import { CellState } from './enums/cell-state'
import { GameState } from './enums/game-state'
import { useGameStore } from '@/store/game'
import type { BoardSettings } from '@/types/board-settings'

const gameStore = useGameStore()
const now = useTimestamp()

async function createGame(settings: BoardSettings) {
  await gameStore.createGame(settings)
  await gameStore.updateBoard()
}

document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

useHead({
  title: 'Minesweeper',
})

const flags = computed(() => {
  const flaggedCells = gameStore.cellsArr.filter(cell => cell.state === CellState.FLAGGED)

  return flaggedCells.length
})

const marks = computed(() => {
  const markedCells = gameStore.cellsArr.filter(cell => cell.state === CellState.MARKED)

  return markedCells.length
})

const time = computed(() => {
  if (gameStore.time.start) {
    if (gameStore.time.end)
      return (gameStore.time.end - gameStore.time.start) / 1000

    else
      return (now.value - gameStore.time.start) / 1000
  }
  else {
    return 0
  }
})
</script>

<template>
  <div class="p-8 grid items-center justify-center">
    <n-h1 class="text-center flex items-center justify-center gap-2">
      <span class="ico-mdi-bomb" />
      <span>Minesweeper</span>
    </n-h1>

    <div class="flex items-center justify-center gap-8">
      <div class="justify-self-center flex items-center justify-center gap-4">
        <n-button @click="createGame({ cols: 10, rows: 10, mines: 10 })">
          Easy
        </n-button>

        <n-button @click="createGame({ cols: 16, rows: 16, mines: 40 })">
          Intermediate
        </n-button>

        <n-button @click="createGame({ cols: 30, rows: 16, mines: 99 })">
          Expert
        </n-button>
      </div>

      <div class="justify-self-center flex items-center justify-center gap-4">
        <n-button circle @click="gameStore.cellSize /= 1.25">
          <template #icon>
            <n-icon class="ico-mdi-minus" />
          </template>
        </n-button>

        <n-button circle @click="gameStore.cellSize *= 1.25">
          <template #icon>
            <n-icon class="ico-mdi-plus" />
          </template>
        </n-button>
      </div>
    </div>

    <div class="p-8 mx-auto space-y-2">
      <div v-if="gameStore.cells.size > 0" class="relative rounded-lg overflow-hidden">
        <Board />
        <Overlay v-if="gameStore.state === GameState.WIN || gameStore.state === GameState.LOSE">
          {{ gameStore.state }}
        </Overlay>
      </div>

      <div class="flex items-center justify-center gap-4 font-mono text-lg">
        <span class="flex items-center justify-center gap-1">
          <n-icon class="ico-mdi-flag text-red-600" />
          <span>{{ flags }}</span>
        </span>

        <span class="flex items-center justify-center gap-1">
          <span class="text-gray-600 font-bold">?</span>
          <span>{{ marks }}</span>
        </span>

        <span class="flex items-center justify-center gap-1">
          <n-icon class="ico-mdi-clock" />
          <span>{{ time.toFixed(2) }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
html, body {
  overflow: hidden;
}
</style>
