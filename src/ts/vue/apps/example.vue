<template lang="pug">
	v-app
		div
			v-tabs
				v-tab(
					@click='$router.push({ path: "/" })'
				)
					v-icon(color="blue darken-2") {{ mdiHome }}
					| home
				v-tab(
					@click='$router.push({ path: "/about/" })'
				)
					v-icon(color="blue darken-2") {{ mdiInformationOutline }}
					| about
		v-main(:class='$style.main')
			v-container
				router-view
</template>

<script>
import { mdiHome, mdiInformationOutline } from '@mdi/js';

export default {
	props: {
		params: Object
	},
	data() {
		return {
			mdiHome,
			mdiInformationOutline
		};
	}
};
</script>

<style lang="scss" module>
.main {
	background: {
		color: hsl(212, 83%, 93%);
	}
}
</style>