<script setup lang="ts">
import {ArrowRight, Plus, X} from 'lucide-vue-next'
import {nextTick, ref} from 'vue'

import router from '@/router'

import {useGameStore} from '@/stores/game'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

const game = useGameStore()

const newPlayerName = ref('')
const startPoints = ref(15)
const newPlayerInput = ref<{$el: HTMLInputElement} | null>(null)

const addPlayer = () => {
  game.addPlayer(newPlayerName.value, startPoints.value)
  newPlayerName.value = ''
  nextTick(() => {
    newPlayerInput.value?.$el.focus()
  })
}
</script>

<template>
  <div class="p-10">
    <h1 class="text-center text-4xl font-extrabold p-10">schnellen</h1>

    <div class="flex">
      <Card class="w-full max-w-sm m-auto">
        <CardHeader>
          <CardTitle>Konfiguration</CardTitle>
          <CardDescription>Bevor gespielt werden kann, müssen bestimmte Parameter definiert werden.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid gap-2">
            <div className="grid w-full max-w-sm items-center gap-2">
              <Label htmlFor="start-points">Startpunkte</Label>
              <Input id="start-points" type="number" placeholder="15" required v-model="startPoints" />
            </div>

            <form class="grid gap-2" @submit.prevent="addPlayer">
              <div className="grid w-full max-w-sm items-center gap-2">
                <Label htmlFor="start-points">Spieler</Label>
                <div class="grid gap-2 grid-cols-[1fr_auto]">
                  <Input
                    id="new-player-input"
                    ref="newPlayerInput"
                    label="Spieler"
                    placeholder="John"
                    :autofocus="true"
                    required
                    v-model="newPlayerName"
                  />
                  <Button size="icon" type="submit" :disabled="newPlayerName === ''">
                    <Plus />
                  </Button>
                </div>
              </div>
            </form>

            <template v-if="Object.keys(game.round).length > 0">
              <Label class="mt-3">Spieler</Label>

              <div v-for="(_, p) in game.round" :key="p" class="grid gap-2 grid-cols-[1fr_auto] items-center">
                <span>{{ p }}</span>
                <Button size="icon" @click.prevent="game.removePlayer(p)">
                  <X />
                </Button>
              </div>
            </template>
          </div>
        </CardContent>
        <CardFooter class="grid gap-2">
          <Button
            :disabled="startPoints < 1 || Object.keys(game.history).map(k => game.history[k]).length < 1"
            @click.prevent="() => router.replace('/game')"
          >
            <ArrowRight />
            <span>Start</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
