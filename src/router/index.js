import Vue from 'vue'
import Router from 'vue-router'
import Estado from '@/components/Estado'
import Cidade from '@/components/Cidade'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Estado',
      component: Estado,
    
    },
    {
      path: '/Cidade/:_id',
      name: 'Cidade',
      component: Cidade,
      // props: true
    }
  ]
})
