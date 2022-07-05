import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import example from './example';

export default new Vuex.Store({
	modules: {
		example
	},
	state: {
		count: 0
	},
	getters: {
		count: state => state.count
	},
	mutations: {
		increment(state) {
			state.count++;
		},
		decrement(state) {
			state.count && state.count--;
		}
	}
});
