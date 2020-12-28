<template>
  <template v-if="step === 1">
    <h1>Schnellen</h1>

    <form class="mb-3" @submit.prevent="addPlayer">
      <text-input id="start-points" type="number" label="Startpunkte" icon="clock" placeholder="15" v-model="startPoints" required />

      <div class="d-flex align-items-flex-end mb-3">
        <text-input id="new-player-input" ref="newPlayerInput" label="Spieler" icon="users" placeholder="John" v-model="newPlayerName" required />
        <div class="ml-3 mb-2">
          <button class="btn btn-primary" type="submit" :disabled="newPlayerName === ''">
            <font-awesome-icon class="icon" icon="plus" />
            <span>Hinzufügen</span>
          </button>
        </div>
      </div>
    </form>

    <div class="players d-flex flex-wrap">
      <div>Gewählte Spieler:</div>
      <div v-for="(_, p) in round" :key="p">
        <span>{{ p }}</span>
        <button class="btn btn-danger btn-small btn-icon" @click.prevent="removePlayer(p)">
          <font-awesome-icon class="icon" icon="times" />
        </button>
      </div>
    </div>

    <button class="btn btn-primary" :disabled="startPoints < 1 || Object.values(history).length < 1" @click.prevent="startGame">
      <font-awesome-icon class="icon" icon="long-arrow-alt-right" />
      <span>Start</span>
    </button>
  </template>
  <template v-else-if="step === 2">
    <div class="horizontal-overflow-scroll">
      <table class="table text-center">
        <thead>
          <tr>
            <th v-for="(_, p) in round" :key="p">
              <strong>
                <small>{{ p }}</small>
              </strong>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in rounds" :key="i">
            <td v-for="(v, p) in history" :key="p">{{ v[i - 1] }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td v-for="(v, p) in round" :key="p">
              <div v-if="v !== null">
                <b>{{ v }}</b>
                Stiche
              </div>
              <div v-else>Raus</div>
              <div class="btn-group">
                <button class="btn btn-primary btn-small btn-icon" :disabled="v > 4 || sumPoints > 4" @click.prevent="addPoint(p)">
                  <font-awesome-icon class="icon" icon="plus" />
                </button>
                <button class="btn btn-primary btn-small btn-icon" v-if="v > 0" @click.prevent="subPoint(p)">
                  <font-awesome-icon class="icon" icon="minus" />
                </button>
                <button class="btn btn-primary btn-small btn-icon" v-if="history[p][history[p].length - 1] > 5 && v === 0" @click.prevent="skipRound(p)">
                  <font-awesome-icon class="icon" icon="sign-out-alt" />
                </button>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <footer class="mb-2">
      <div class="round">
        <b>Runde {{ rounds }}</b>
      </div>
      <div class="multiplier">
        <button class="btn btn-primary btn-small btn-icon" @click.prevent="subMult()" :disabled="multiplier === 1">
          <font-awesome-icon class="icon" icon="minus" />
        </button>
        <div class="badge danger rad">
          <small>x</small>
          {{ multiplier }}
        </div>
        <button class="btn btn-primary btn-small btn-icon" @click.prevent="addMult()">
          <font-awesome-icon class="icon" icon="plus" />
        </button>
      </div>
      <button class="btn btn-danger btn-small btn-icon" :disabled="rounds < 2" @click.prevent="undoRound">
        <font-awesome-icon class="icon" icon="undo" />
      </button>
      <button class="btn btn-primary btn-icon next" @click.prevent="nextRound">
        <font-awesome-icon class="icon" icon="angle-right" />
      </button>
    </footer>
  </template>
</template>

<script lang="ts">
import Vue, {computed, defineComponent, nextTick, ref} from 'vue'
import TextInput from './components/TextInput.vue'
import './assets/style/main.scss'

export default defineComponent({
  name: 'App',
  components: {
    TextInput
  },
  setup(props, ctx) {
    const step = ref(1)
    const newPlayerName = ref('')
    const startPoints = ref(15)
    const rounds = ref(1)
    const multiplier = ref(1)
    const history = ref<Record<string, number[]>>({})
    const round = ref<Record<string, number | null>>({})

    const newPlayerInput = ref<HTMLInputElement>()

    const sumPoints = computed(() => Object.values(round.value).reduce((sum, points) => sum! + points!, 0))

    const addPlayer = () => {
      history.value[newPlayerName.value] = [startPoints.value]
      round.value[newPlayerName.value] = 0
      newPlayerName.value = ''
      newPlayerInput.value?.focus()
    }

    const removePlayer = (pl: string) => {
      delete history.value[pl]
      delete round.value[pl]
    }

    const startGame = () => {
      step.value++
    }

    const addPoint = (p: string) => {
      round.value[p]!++
    }

    const subPoint = (p: string) => {
      round.value[p]!--
    }

    const skipRound = (p: string) => {
      round.value[p] = null
    }

    const addMult = () => {
      multiplier.value <<= 1
    }

    const subMult = () => {
      multiplier.value >>= 1
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
      multiplier.value = 1
      rounds.value++

      // scroll to bottom
      nextTick(() => window.scrollTo(0, document.body.scrollHeight))
    }

    const undoRound = () => {
      for (const p in round.value) {
        history.value[p].splice(-1, 1)
        round.value[p] = 0
      }
      rounds.value--
    }

    return {
      step,
      newPlayerName,
      startPoints,
      rounds,
      multiplier,
      history,
      round,
      sumPoints,

      addPlayer,
      removePlayer,
      startGame,
      addPoint,
      subPoint,
      skipRound,
      addMult,
      subMult,
      nextRound,
      undoRound
    }
  }
})
</script>
