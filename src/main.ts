import Vue from 'vue'

import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faCog,
  faClock,
  faUsers,
  faTimes,
  faMinus,
  faUndo,
  faSignOutAlt,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import App from '@/App.vue'

library.add(faPlus, faMinus, faCog, faClock, faUsers, faTimes, faUndo, faSignOutAlt, faAngleRight)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
  render: (h: any) => h(App)
}).$mount('#app')
