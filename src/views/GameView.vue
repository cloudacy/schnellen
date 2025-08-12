<script setup lang="ts">
import {nextTick} from 'vue'
import {BrushCleaning, ChevronRight, DoorClosed, Minus, Plus, Undo2} from 'lucide-vue-next'

import router from '@/router'

import {useGameStore} from '@/stores/game'

import {Button} from '@/components/ui/button'
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from '@/components/ui/table'

const game = useGameStore()

const nextRound = () => {
  game.nextRound()

  // scroll to bottom
  nextTick(() => window.scrollTo(0, document.body.scrollHeight))
}

const reset = () => {
  game.reset()
  router.replace('/')
}
</script>

<template>
  <div class="grid grid-rows-[1fr_auto_auto] max-w-[100svw] min-h-[100svh] gap-5">
    <div class="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="(_, p) in game.round" :key="p">
              {{ p }}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="i in game.rounds" :key="i">
            <TableCell v-for="(v, p) in game.history" :key="p">{{ v[i - 1] }}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell v-for="(v, p) in game.round" :key="p">
              <div class="flex flex-col gap-2">
                <div v-if="v !== null">
                  <strong>{{ v }}</strong>
                  Stiche
                </div>
                <div v-else>Raus</div>
                <div class="grid grid-cols-[auto_auto_1fr] gap-2">
                  <Button
                    size="icon"
                    :disabled="v !== null && (v >= 5 || game.sumPoints >= 5)"
                    @click.prevent="game.addPoint(p)"
                  >
                    <Plus />
                  </Button>
                  <Button v-if="v !== null && v > 0" size="icon" @click.prevent="game.subPoint(p)">
                    <Minus />
                  </Button>
                  <Button
                    v-if="game.history[p][game.history[p].length - 1] > 5 && v === 0"
                    size="icon"
                    @click.prevent="game.skipRound(p)"
                  >
                    <DoorClosed />
                  </Button>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
    <div class="flex gap-2 items-center px-2">
      Multiplikator:
      <Button size="icon" :disabled="game.multiplier === 1" @click.prevent="game.subMult()">
        <Minus />
      </Button>
      <span><small>x</small>{{ game.multiplier }}</span>
      <Button size="icon" @click.prevent="game.addMult()">
        <Plus />
      </Button>
    </div>
    <footer class="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center px-2 pb-2">
      <div class="round">
        <strong>Runde&nbsp;{{ game.rounds }}</strong>
      </div>
      <Button size="icon" @click.prevent="reset">
        <BrushCleaning />
      </Button>
      <Button size="icon" :disabled="game.rounds < 2" @click.prevent="game.undoRound">
        <Undo2 />
      </Button>
      <Button size="icon" @click.prevent="nextRound">
        <ChevronRight />
      </Button>
    </footer>
  </div>
</template>
