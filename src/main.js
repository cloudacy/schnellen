import Vue from 'vue'
import Icon from 'v-icon'

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Icon, {
  icons: {
    check: 'check',
    leave: 'sign-out',
    minus: 'minus',
    next: 'angle-right',
    plus: 'plus',
    times: 'times',
    undo: 'undo'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
