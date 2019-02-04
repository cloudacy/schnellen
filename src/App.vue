<template lang="pug">
#app
  template(v-if="step === 1")
    label.lbl Startpunkte
    input.input(type="number" v-model="startPoints")
    label.lbl Spieler
    .players.d-flex.mb-2
      .badge.primary(v-for="p, i in players") {{p}}
        button(@click.prevent="removePlayer(i)"): v-icon(name="times")
    form.d-flex.align-items-center.mb-3(@submit.prevent="addPlayer")
      input.input.mr-3(type="text" ref="newPlayerInput" v-model="newPlayerName" placeholder="Name" required)
      button.btn.primary(type="submit"): v-icon(name="plus")
    button.btn.primary(:disabled="startPoints < 1 || players.length < 1" @click.prevent="startGame") Start
  template(v-if="step === 2")
    div.mb-2
      b Runde:
      span &nbsp;{{rounds}}
      b.ml-2 Geber:
      span &nbsp;{{players[(rounds - 1) % players.length]}}
    .table-wrap
      table.table
        thead
          tr
            th(v-for="p in players") {{p}}
        tbody
          tr(v-for="i in rounds")
            td(v-for="p in players") {{history[p][i - 1]}}
        tfoot
          tr
            td(v-for="p in players")
              div {{round[p] !== null ? round[p] + ' Stiche' : 'Raus'}}
              .btn-group.point-ctl
                button.btn.primary(:disabled="round[p] > 4 || sumPoints > 4" @click.prevent="addPoint(p)"): v-icon(name="plus")
                button.btn.primary(v-if="round[p] > 0" @click.prevent="subPoint(p)"): v-icon(name="minus")
                button.btn.primary(v-if="history[p][history[p].length - 1] > 5 && round[p] === 0" @click.prevent="skipRound(p)"): v-icon(name="leave")
    footer
      .mult
        .badge.red.rad
          small x
          span {{multiplier}}
        button.btn.primary.ml-2(@click.prevent="addMult()"): v-icon(name="plus")
        button.btn.primary.ml-2(@click.prevent="subMult()" :disabled="multiplier === 1"): v-icon(name="minus")
      button.btn.primary.round(:disabled="rounds < 2" @click.prevent="undoRound"): v-icon(name="undo")
      button.btn.primary.round.next(@click.prevent="nextRound"): v-icon(name="next")
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      step: 1,
      newPlayerName: '',
      startPoints: 15,
      players: [],
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
      this.players.push(this.newPlayerName)
      this.newPlayerName = ''
      this.$refs.newPlayerInput.focus()
    },
    removePlayer(i) {
      this.players.splice(i, 1)
    },
    startGame() {
      for (const p of this.players) {
        this.$set(this.history, p, [Number(this.startPoints)])
        this.$set(this.round, p, 0)
      }
      this.step++
    },
    addPoint(p) {
      this.round[p] = Math.min(this.round[p] + 1, 5)
    },
    subPoint(p) {
      this.round[p] = Math.max(this.round[p] - 1, 0)
    },
    skipRound(p) {
      this.round[p] = null
    },
    addMult() {
      this.multiplier *= 2
    },
    subMult() {
      this.multiplier = Math.max(this.multiplier / 2, 1)
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
        console.log(this.history[p])
      }
      this.rounds--
    }
  }
}
</script>

<style lang="stylus">
@import '~@/assets/style/main.styl'
</style>
