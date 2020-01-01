import App from "./App.vue";
import Vue from "vue";
import Vuex from "vuex";

import axios from "axios";
import io from "socket.io-client";

Vue.use(Vuex);

(async () => {
	const token = location.pathname.replace(/[^a-z0-9]/g, '');
	
	const store = new Vuex.Store({
		state: {
			queue: [],
			current: null,
			playing: false
		},
		
		mutations: {
			setQueue(state, data) {
				state.queue = data;
			},
			
			setCurrent(state, current) {
				state.current = current;
			},
			
			setPlaying(state, playing) {
				state.playing = playing;
			}
		},
		
		actions: {
			async refreshQueue({ commit }) {
				const {data} = await axios({
					method: 'get',
					url: `/${token}/queue`
				});
				
				commit('setQueue', data);
			},
			
			async next({ commit, dispatch }) {
				const {data} = await axios({
					method: 'post',
					url: `/${token}/next`
				});
				
				commit('setCurrent', data.next);
				commit('setQueue', data.queue);
			}
		}
	});
	
	const socket = io();
	socket.on('refresh', () => {
		store.dispatch('refreshQueue');
	});
	
	socket.emit('authenticate', token);

	const vm = new Vue({
		el: '#App',
		store,
		render(h) {
			return h(App);
		}
	});
})();
