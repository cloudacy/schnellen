import Vue from 'vue'
import Icon from 'v-icon'

import App from '@/App.vue'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Icon, {
  icons: {
    clock: 'clock',
    check: 'check',
    cog: 'cog',
    minus: 'minus',
    plus: 'plus',
    times: 'times',
    undo: 'undo',
    users: 'users'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
