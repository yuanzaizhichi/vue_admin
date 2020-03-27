import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    roles: []
  },
  getters: {
    roles: state => state.roles
  },
  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    setUserRoles(context, roles) {
      context.commit('SET_ROLES', roles)
    }
  }
})

export default store
