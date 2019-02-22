<template lang="pug">
#app.p-4
  template(v-if="step === 1")
    h1 Spiel starten
    p.text-muted.mb-3 Bevor das Spiel beginnen kann, müssen der Startpunktestand sowie alle Teilnehmer eingetragen werden.

    label.input.mb-3
      v-icon(name="clock")
      .f-1
        .lbl Startpunkte
        input(type="number" v-model="startPoints")

    form.mb-3(@submit.prevent="addPlayer")
      label.input
        v-icon(name="users")
        .f-1
          .lbl Spieler
          input(type="text" ref="newPlayerInput" v-model="newPlayerName" placeholder="Name" required)
        div
          button.btn.primary.btn-round(type="submit" :disabled="newPlayerName === ''"): v-icon(name="plus")

    .players.d-flex
      .badge.primary.mb-3(v-for="_, p in round") {{p}}
        button(@click.prevent="removePlayer(p)"): v-icon(name="times" center)

    button.btn.primary(:disabled="startPoints < 1 || Object.values(history).length < 1" @click.prevent="startGame") Start
  template(v-if="step === 2")
    div.mb-2
      b Runde:
      | &nbsp;{{rounds}}
    .table-wrap
      table.table
        thead
          tr
            th(v-for="_, p in round"): small {{p}}
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
              .btn-group.point-ctl
                button.btn.primary.small(:disabled="v > 4 || sumPoints > 4" @click.prevent="addPoint(p)"): v-icon(name="plus")
                button.btn.primary.small(v-if="v > 0" @click.prevent="subPoint(p)"): v-icon(name="minus")
                button.btn.primary.small(v-if="history[p][history[p].length - 1] > 5 && v === 0" @click.prevent="skipRound(p)"): v-icon(name="leave")
    footer
      .mult
        .badge.red.rad
          small x
          | {{multiplier}}
        button.btn.primary.small.ml-2(@click.prevent="addMult()"): v-icon(name="plus")
        button.btn.primary.small.ml-2(@click.prevent="subMult()" :disabled="multiplier === 1"): v-icon(name="minus")
      button.btn.primary.small.round(:disabled="rounds < 2" @click.prevent="undoRound"): v-icon(name="undo")
      button.btn.primary.round.next(@click.prevent="nextRound"): v-icon(name="next")
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'app',
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
      this.$refs.newPlayerInput.focus()
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
        else if (this.round[p] > 0) this.history[p].push(this.history[p][this.history[p].length - 1] - this.round[p] * this.multiplier)
        else if (this.round[p] === null) this.history[p].push(this.history[p][this.history[p].length - 1] + 2 * this.multiplier)
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

<style lang="stylus">
@import '~@/assets/style/main.styl'
</style>
