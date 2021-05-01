import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as flag from './plugins/flag.js'
import * as clipboard from './plugins/clipboard.js'
import * as element from './plugins/element.js'
import * as veeValidate from './plugins/vee-validate'
import * as vueModal from './plugins/vue-js-modal.js'

Vue.config.productionTip = false

new Vue({
    router,
    flag,
    store,
    element,
    clipboard,
    veeValidate,
    vueModal,
    render: h => h(App)
}).$mount('#app')