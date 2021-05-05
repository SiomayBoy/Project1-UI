import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
        isLoggedIn: false, 
  },
  mutations: {
        set_user (state, data) {
        state.user = data
        state.isLoggedIn = true
        }, 
        reset_user (state) {
        state.user = null
        state.isLoggedIn = false
        },
        }, getters: {
        isLoggedIn (state){
        return state.isLoggedIn
        },
        user (state) {
        return state.user
        }
    
  },
  actions: {
    login({ dispatch, commit }, data) {
    return new Promise((resolve, reject) => { 
      axios.post('login', data)
       .then(response => {
         const token = response.data.token  
         localStorage.setItem('token', token) 
         axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
         dispatch('get_user')
         resolve(response)
       })
       .catch(err => {
         commit('reset_user')  
         localStorage.removeItem('token')
         reject(err)
      })
    })
  },
  async get_user({commit}){ 
    if(!localStorage.getItem('token')){
      return
    }
    try{ 
      let response = await axios.get('user')
        commit('set_user', response.data.data)
    } catch (error){
        commit('reset_user') 
        delete axios.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
        return error
    } 
    },
    logout({ commit }) {
      return new Promise((resolve) => {
      commit('reset_user')
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      resolve()
      })
    },
    register({ commit }, data) {
      return new Promise((resolve, reject) => { 
      axios.post('register', data)
      .then(resp => { 
       resolve(resp)
      })
   .catch(err => {
    commit('reset_user')   
    reject(err)
   })
 })
},
  }
})
