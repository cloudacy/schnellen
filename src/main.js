import Vue from 'vue'
import Icon from 'v-icon'

import App from './App.vue'

Vue.config.productionTip = false
Vue.config.devtools = false

Vue.use(Icon, {
  icons: {
    plus: 'plus',
    minus: 'minus',
    times: 'times',
    leave: 'sign-out',
    check: 'check',
    next: 'angle-right'
  }
})

new Vue({
  render: h => h(App)
}).$mount('#app')
