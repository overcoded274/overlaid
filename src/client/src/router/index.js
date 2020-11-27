import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/readme',
    name: 'readme',
    // route level code-splitting
    // this generates a separate chunk (readme.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "readme" */ '../views/Readme.vue')
  },
  {
    path: '/resolution',
    name: 'resolution',
    component: () => import(/* webpackChunkName: "resolution" */ '../views/Resolution.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
