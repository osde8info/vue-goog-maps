import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: colors.amber.darken2,
    secondary: '#005fff', // colors.grey.darken1,
    accent: '#ff005f', // colors.shades.black,
    error: '#ff2000' // colors.red.accent3
  }
})
