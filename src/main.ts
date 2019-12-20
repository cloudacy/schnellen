import Vue from 'vue'

import {library} from '@fortawesome/fontawesome-svg-core'
import {
  faAngleRight,
  faCog,
  faClock,
  faLongArrowAltRight,
  faMinus,
  faPlay,
  faPlus,
  faSignOutAlt,
  faTimes,
  faUndo,
  faUsers
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

import App from '@/App.vue'

library.add(faAngleRight, faCog, faClock, faLongArrowAltRight, faMinus, faPlay, faPlus, faSignOutAlt, faTimes, faUndo, faUsers)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.config.devtools = false

new Vue({
  render: (h: any) => h(App)
}).$mount('#app')
