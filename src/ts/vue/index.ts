import Vue from 'vue';
import store from './store';
import * as apps from './apps';

// import * as components from './components';
import * as directives from './directives';
import * as plugins from './plugins';
import * as filters from './filters';

const list = document.querySelectorAll('[data-is]') as NodeListOf<Element>;

for (const key in plugins)
	Vue.use(plugins[key]);
for (const key in filters)
	Vue.filter(key, filters[key]);
for (const key in directives)
	Vue.directive(key, directives[key]);

/* for (const key in components)
	Vue.component(`c-${key}`, components[key]); */

for (const el of Array.from(list)) {
	const name: string = el.getAttribute('data-is');

	try {
		const params: string = el.getAttribute('data-params') || '{}';
		const props = {
			params: JSON.parse(params.replace(/'/g, '"'))
		};

		new Vue({
			store,
			render:  h => {
				return h(apps[name], {
					props
				});
			}
		}).$mount(el);
	}
	catch ({ message }) {
		throw new Error(`Перевірте об'єкт параметрів компонента ${name}`);
	}
}