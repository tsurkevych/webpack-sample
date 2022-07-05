import Vue from 'vue';
import Router from 'vue-router';
export const home = () => import('_ts/vue/pages/index.vue');
export const about = () => import('_ts/vue/pages/about.vue');

Vue.use(Router);

export default new Router({
	// mode:   'history',
	routes: [
		{
			path:      '/',
			component: home
		}, {
			path:      '/about/',
			component: about
		}
	]
});