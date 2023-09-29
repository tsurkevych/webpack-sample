/* eslint-disable @typescript-eslint/no-unused-vars */
import Vue from 'vue';

declare module 'vue/types/vue' {

	interface Vue {
		install: any;
		vuetify: any;
		$xhr?: any;
		xhr?: any;
	}

	interface VueConstructor {
		install: any;
		vuetify: any;
		$xhr?: any;
		xhr?: any;
	}
}

declare module 'vue/types/options' {
	interface ComponentOptions<V extends Vue> {
		$xhr?: any;
		xhr?: any;
	}
	interface VueConstructor {
		vuetify: any;
		$xhr?: any;
		xhr?: any;
	}
}