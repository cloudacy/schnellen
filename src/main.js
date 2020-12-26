import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faAngleRight, faCog, faClock, faLongArrowAltRight, faMinus, faPlay, faPlus, faSignOutAlt, faTimes, faUndo, faUsers)

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
