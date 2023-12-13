<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import type { CreateGameDto } from './dtos/create-game.dto'
import { CellState } from './enums/cell-state'
import { GameDifficulty } from './enums/game-difficulty'
import { GameState } from './enums/game-state'
import { useGameStore } from '@/store/game'

const gameStore = useGameStore()
const now = useTimestamp()

useDark({
  valueDark: 'dark',
  valueLight: 'light',
  initialValue: 'auto',
})

async function createGame(dto: CreateGameDto) {
  await gameStore.createGame(dto)
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

const opened = computed(() => {
  const openedCells = gameStore.cellsArr.filter(cell => cell.state === CellState.OPENED)

  return openedCells.length
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
  <NConfigProvider :theme="darkTheme" abstract>
    <div class="p-8 grid items-center justify-center">
      <n-h1 class="text-center flex items-center justify-center gap-2">
        <span class="ico-mdi-bomb" />
        <span>Minesweeper</span>
      </n-h1>

      <div class="flex items-center justify-center gap-8">
        <div class="justify-self-center flex items-center justify-center gap-4">
          <n-button @click="createGame({ difficulty: GameDifficulty.BEGINNER })">
            Easy
          </n-button>

          <n-button @click="createGame({ difficulty: GameDifficulty.INTERMEDIATE })">
            Intermediate
          </n-button>

          <n-button @click="createGame({ difficulty: GameDifficulty.EXPERT })">
            Expert
          </n-button>
        </div>

        <div class="justify-self-center flex items-center justify-center gap-4">
          <n-button circle @click="gameStore.cellSize *= 0.75">
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

      <div class="p-8 mx-auto space-y-4 flex flex-col justify-center items-center">
        <div v-if="gameStore.cells.size > 0" class="relative">
          <Board />
          <Overlay v-if="gameStore.state === GameState.WIN || gameStore.state === GameState.LOSE">
            {{ gameStore.state }}
          </Overlay>
        </div>

        <div class="flex items-center justify-center gap-12 font-mono text-xl">
          <span class="flex items-center justify-center gap-2">
            <span class="text-gray-600 font-bold">Open</span>
            <span>{{ opened }} / {{ gameStore.cells.size > 0 ? gameStore.cells.size - gameStore.settings.mines : 0 }} ({{ (100 * opened / (gameStore.cells.size - gameStore.settings.mines)).toFixed(1) }}%)</span>
          </span>

          <span class="flex items-center justify-center gap-2">
            <n-icon class="ico-mdi-flag text-red-600" />
            <span>{{ flags }}</span>
          </span>

          <span class="flex items-center justify-center gap-2">
            <span class="text-gray-600 font-bold">?</span>
            <span>{{ marks }}</span>
          </span>

          <span class="flex items-center justify-center gap-2">
            <n-icon class="ico-mdi-clock" />
            <span>{{ time.toFixed(3) }}</span>
          </span>
        </div>
      </div>
    </div>
  </NConfigProvider>
</template>

<style lang="postcss">
html, body {
  overflow: hidden;
}

html.dark {
  background-color: #16161a;
  color: #cdcddd;
}
</style>
