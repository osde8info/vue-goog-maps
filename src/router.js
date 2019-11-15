import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Contacts from '@/views/Contacts.vue'
import Users from '@/views/Users.vue'
import SignIn from '@/views/SignIn.vue'
import ContactModalForm from '@/components/ContactModalForm.vue'
import AuthService from '@/services/AuthService'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/contacts',
      name: 'contacts',
      component: Contacts,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'create',
          name: 'contact-create',
          component: ContactModalForm,
          props: true
        },
        {
          path: 'edit/:id',
          name: 'contact-edit',
          component: ContactModalForm,
          props: true
        }
      ]
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/sigin',
      name: 'sigin',
      component: SignIn
    }
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ]
})

router.beforeEach(async (routeTo, routeFrom, next) => {
  // get the current user
  const currentUser = await AuthService.getCurrentUser()

  const requiresAuth = routeTo.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    if (currentUser) {
      next()
      return
    }
    next('sigin')
  } else {
    next()
  }
})

export default router
