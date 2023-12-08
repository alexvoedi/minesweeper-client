<script setup lang="ts">
import { CellState } from '../enums/cell-state'
import CellComponent from './cell.vue'
import type { Cell } from '@/types/cell'
import { useGameStore } from '@/store/game'

const gameStore = useGameStore()

function setAdjacentCellHighlight({ x, y, highlight }: { x: number, y: number, highlight: boolean }) {
  if (highlight) {
    const adjacentCells: Cell[] = []

    for (let i = x - 1; i <= x + 1; i++) {
      for (let j = y - 1; j <= y + 1; j++) {
        if (i === x && j === y)
          continue

        const isInBounds = gameStore.isInBounds([i, j])

        if (!isInBounds)
          continue

        const cell = gameStore.getCell([i, j])

        adjacentCells.push(cell)
      }
    }

    const closedAdjacentCells = adjacentCells.filter(cell => cell.state === CellState.CLOSED)

    closedAdjacentCells.forEach(cell => cell.highlight = highlight)
  }
  else {
    gameStore.cells.forEach(cell => cell.highlight = highlight)
  }
}
</script>

<template>
  <div>
    <div v-for="y in gameStore.settings.rows" :key="y" class="flex">
      <template v-for="x in gameStore.settings.cols" :key="x">
        <CellComponent :cell="gameStore.getCell([x - 1, y - 1])" @set-adjacent-cell-highlight="setAdjacentCellHighlight" />
      </template>
    </div>
  </div>
</template>

<style lang="postcss">
</style>
