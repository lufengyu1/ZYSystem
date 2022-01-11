import { createStore } from 'vuex'

export default createStore({
  state: {
    loginObj: {},
  },
  mutations: {
    LOGINING(state, val) {
      state.loginObj = val;
    }
  },
  actions: {
    logining(context, val) {
      context.commit('LOGINING', val);
    }
  },
  modules: {
  }
})
