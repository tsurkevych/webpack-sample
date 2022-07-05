/**
 * @author Petro Tsurkevych
 * @summary Запит
 * @example this.$xhr
 * @example Vue.xhr
 */

import axios, { AxiosPromise } from 'axios';
import { VueConstructor } from 'vue';
import { XhrParams } from '_ts/types';

class XHR {
	public static install(Vue: VueConstructor) {
		Vue.prototype.$xhr = XHR.send;
		Vue.xhr = Vue.prototype.$xhr;
	}

	public static send(payload: XhrParams): AxiosPromise {
		const method = payload.method.toLowerCase();
		const url = payload.url;
		const params = payload.params;

		switch (method) {
			case 'post':
				return axios
					.post(url, params);
			default:
				return axios.get(url, { params });
		}
	}
}

export default XHR;