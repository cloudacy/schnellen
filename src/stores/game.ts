import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

export const useGameStore = defineStore(
  'game',
  () => {
    const round = ref<Record<string, number | null>>({})
    const history = ref<Record<string, number[]>>({})
    const multiplier = ref(1)

    const rounds = computed(() => Object.values(history.value).reduce((n, v) => Math.max(n, v.length), 0))

    const sumPoints = computed(() =>
      Object.keys(round.value)
        .map(k => round.value[k])
        .filter((v): v is number => v !== null)
        .reduce((sum, points) => sum + points, 0)
    )

    const addPlayer = (newPlayerName: string, startPoints: number) => {
      history.value[newPlayerName] = [startPoints]
      round.value[newPlayerName] = 0
    }

    const removePlayer = (pl: string) => {
      delete history.value[pl]
      delete round.value[pl]
    }

    const addPoint = (p: string) => {
      round.value[p]!++
    }

    const subPoint = (p: string) => {
      round.value[p]!--
    }

    const addMult = () => {
      multiplier.value *= 2
    }

    const subMult = () => {
      multiplier.value /= 2
    }

    const nextRound = () => {
      for (const p in round.value) {
        if (round.value[p] === 0) {
          // Player lost round.
          history.value[p].push(history.value[p][history.value[p].length - 1] + 5 * multiplier.value)
        } else if (round.value[p]! > 0) {
          // Player won round with x cards.
          history.value[p].push(history.value[p][history.value[p].length - 1] - round.value[p]! * multiplier.value)
        } else if (round.value[p] === null) {
          // Player skipped round.
          history.value[p].push(history.value[p][history.value[p].length - 1] + 1 * multiplier.value)
        }
        round.value[p] = 0
      }
    }

    const undoRound = () => {
      for (const p in round.value) {
        history.value[p].splice(-1, 1)
        round.value[p] = 0
      }
    }

    const skipRound = (p: string) => {
      round.value[p] = null
    }

    const reset = () => {
      history.value = {}
      round.value = {}
      multiplier.value = 1
    }

    return {
      rounds,
      round,
      history,
      multiplier,
      sumPoints,
      addPlayer,
      removePlayer,
      addPoint,
      subPoint,
      addMult,
      subMult,
      nextRound,
      undoRound,
      skipRound,
      reset
    }
  },
  {
    persist: {
      storage: sessionStorage
    }
  }
)
