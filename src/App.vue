<template lang="pug">
#app
  template(v-if="step === 1")
    label Startpunkte
    input(type="number" v-model="startPoints")
    label Spieler
    div(v-for="p, i in players") {{p}}
      button(@click.prevent="removePlayer(i)"): v-icon(name="times")
    form(@submit.prevent="addPlayer")
      input(type="text" ref="newPlayerInput" v-model="newPlayerName" placeholder="Name" required)
      button(type="submit"): v-icon(name="plus")
    button(:disabled="startPoints < 1 || players.length < 1" @click.prevent="startGame") Start
  template(v-if="step === 2")
    div
      label Runde
      span {{rounds}}
    table
      thead
        tr
          th(v-for="p in players") {{p}}
      tbody
        tr(v-for="i in rounds")
          td(v-for="p in players") {{history[p][i - 1]}}
      tfoot
        tr
          td(v-for="p in players") {{round[p] !== null ? round[p] + ' Stiche' : 'Raus'}}
        tr
          td(v-for="p in players")
            .btn-group
              button(@click.prevent="addPoint(p)"): v-icon(name="plus")
              button(@click.prevent="subPoint(p)"): v-icon(name="minus")
              button(@click.prevent="skipRound(p)" :disabled="history[p][history[p].length - 1] < 6"): v-icon(name="leave")
        //tr
          td(v-for="p in players")
            input(type="radio" name="currentPlayer")
    .mult
      .rad
        small x
        span {{multiplier}}
      button(@click.prevent="addMult()"): v-icon(name="plus")
      button(@click.prevent="subMult()"): v-icon(name="minus")
    button.next(@click.prevent="nextRound"): v-icon(name="next")
</template>

<script>
import Vue from 'vue'

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
      return Object.values(this.round).reduce((sum, points) => {
        return sum += points
      }, 0)
    }
  },
  methods: {
    addPlayer() {
      console.log(this.players)
      this.players.push(this.newPlayerName)
      this.newPlayerName = ''
      this.$refs.newPlayerInput.focus()
    },
    removePlayer(i) {
      this.players.splice(i, 1)
    },
    startGame() {
      for (const p of this.players) {
        Vue.set(this.history, p, [Number(this.startPoints)])
        Vue.set(this.round, p, 0)
      }
      this.step++
    },
    addPoint(p) {
      if (this.sumPoints >= 5) {
        return
      }

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
      Vue.nextTick(() => window.scrollTo(0, document.body.scrollHeight))
    }
  }
}
</script>

<style lang="stylus">
$blue = #156FA4
$grey = #ccc
$grey-light = lighten($grey, 10%)

*
  outline: none
  box-sizing: border-box

body
  font-family: sans-serif
  font-weight: 100

.icon
  width: 1em
  height: 1em

  svg
    width: 1em
    height: 1em
    fill: currentColor

input, button
  padding: 0.25em
  color: inherit
  font: inherit
  background: #fff
  border: 1px solid $blue
  border-radius: 4px
  line-height: 1
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25)
  appearance: none

button
  color: #fff
  background: $blue
  cursor: pointer

  &:disabled
    background: $grey-light
    border: $grey
    cursor: default

label
  display: block
  font-weight: bold

table
  width: 100%
  margin-top: 16px
  margin-bottom: 50px + 16px + 16px // space for next button
  border: none
  border-radius: 4px
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25)
  border-collapse: collapse
  table-layout: fixed
  overflow: hidden

  td, th
    padding: 0.5em

  td:not(:last-child), th:not(:last-child)
    border-right: 1px solid #ccc

  thead
    border-bottom: 1px solid #ccc
    background: lighten($blue, 90%)

  tfoot
    background: #eee
    border-top: 1px solid #ccc

.mult
  position: fixed
  bottom: 16px
  left: 16px
  display: flex
  align-items: center

  .rad
    display: inline-block
    padding: 0.5em
    min-width: 2em
    height: 2em
    margin-right: 8px
    color: white
    background: red
    border-radius: 1em
    line-height: 1

  button + button
    margin-left: 8px

.next
  position: fixed
  bottom: 16px
  right: 16px
  padding: 0.5em
  border-radius: 50%
  font-size: 1.5em
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.5)

.btn-group
  display: flex
  flex-flow: row wrap

  button
    &:first-child
      border-radius: 4px 0 0 4px

    &:last-child
      border-radius: 0 4px 4px 0

    &:not(:first-child):not(:last-child)
      border-radius: 0
</style>
