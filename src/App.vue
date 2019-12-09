<template lang="pug">
#app.p-4
  template(v-if="step === 1")
    h1 Schnellen

    h2
      font-awesome-icon(icon="cog")
      | Spieloptionen
    p.text-muted.mb-3 Bevor das Spiel beginnen kann, müssen der Startpunktestand sowie alle Teilnehmer eingetragen werden.

    font-awesome-icon(icon="clock")
    TextInput(label="Startpunkte" type="number" v-model="startPoints" required)

    form.mb-3(@submit.prevent="addPlayer")
      font-awesome-icon(icon="users")
      .d-flex.align-items-flex-end.mb-3
        TextInput(id="new-player-input" label="Spieler" placeholder="Name" v-model="newPlayerName" required)
        .ml-3.mb-2
          button.btn.primary.btn-round(type="submit" :disabled="newPlayerName === ''"): font-awesome-icon(icon="plus")
      .players.d-flex.flex-wrap
        .badge.primary(v-for="_, p in round") {{p}}
          button(@click.prevent="removePlayer(p)"): font-awesome-icon(icon="times")

    button.btn.primary(:disabled="startPoints < 1 || Object.values(history).length < 1" @click.prevent="startGame") Start
  template(v-if="step === 2")
    header
      table
        thead
          tr
            th(v-for="_, p in round"): small {{p}}
    table.table
      tbody
        tr(v-for="i in rounds")
          td(v-for="v, p in history") {{v[i - 1]}}
      tfoot
        tr
          td(v-for="v, p in round")
            div(v-if="v !== null")
              b {{v}}
              | &nbsp;Stiche
            div(v-else) Raus
            .btn-group.primary.point-ctl
              button.btn.primary.small(:disabled="v > 4 || sumPoints > 4" @click.prevent="addPoint(p)"): font-awesome-icon(icon="plus")
              button.btn.primary.small(v-if="v > 0" @click.prevent="subPoint(p)"): font-awesome-icon(icon="minus")
              button.btn.primary.small(v-if="history[p][history[p].length - 1] > 5 && v === 0" @click.prevent="skipRound(p)"): font-awesome-icon(icon="sign-out-alt")
    footer.mb-2
      .round
        b Runde:
        | &nbsp;{{rounds}}
      .multiplier
        .badge.danger.rad
          small x
          | {{multiplier}}
        button.btn.primary.small.ml-2(@click.prevent="addMult()"): font-awesome-icon(icon="plus")
        button.btn.primary.small.ml-2(@click.prevent="subMult()" :disabled="multiplier === 1"): font-awesome-icon(icon="minus")
      button.btn.primary.small.round(:disabled="rounds < 2" @click.prevent="undoRound")
        font-awesome-icon(icon="undo")
      button.btn.primary.round.next(@click.prevent="nextRound")
        font-awesome-icon(icon="angle-right")
</template>

<script>
import Vue from 'vue'

import TextInput from '@/components/TextInput.vue'

export default Vue.extend({
  name: 'App',
  components: {
    TextInput
  },
  data() {
    return {
      step: 1,
      newPlayerName: '',
      startPoints: 15,
      rounds: 1,
      multiplier: 1,
      history: {},
      round: {}
    }
  },
  computed: {
    sumPoints() {
      return Object.values(this.round).reduce((sum, points) => sum + points, 0)
    }
  },
  methods: {
    addPlayer() {
      this.$set(this.history, this.newPlayerName, [Number(this.startPoints)])
      this.$set(this.round, this.newPlayerName, 0)
      this.newPlayerName = ''
      document.querySelector('#new-player-input').focus()
    },
    removePlayer(pl) {
      this.$delete(this.history, pl)
      this.$delete(this.round, pl)
    },
    startGame() {
      this.step++
    },
    addPoint(p) {
      this.round[p]++
    },
    subPoint(p) {
      this.round[p]--
    },
    skipRound(p) {
      this.round[p] = null
    },
    addMult() {
      this.multiplier <<= 1
    },
    subMult() {
      this.multiplier >>= 1
    },
    nextRound() {
      for (const p in this.round) {
        if (this.round[p] === 0) this.history[p].push(this.history[p][this.history[p].length - 1] + 5 * this.multiplier)
        else if (this.round[p] > 0)
          this.history[p].push(this.history[p][this.history[p].length - 1] - this.round[p] * this.multiplier)
        else if (this.round[p] === null)
          this.history[p].push(this.history[p][this.history[p].length - 1] + 2 * this.multiplier)
        this.round[p] = 0
      }
      this.multiplier = 1
      this.rounds++

      // scroll to bottom
      this.$nextTick(() => window.scrollTo(0, document.body.scrollHeight))
    },
    undoRound() {
      for (const p in this.round) {
        this.history[p].splice(-1, 1)
        this.round[p] = 0
      }
      this.rounds--
    }
  }
})
</script>

<style lang="scss">
@import '~@/assets/style/main';
</style>
