<template lang="pug">
div
	v-alert(type="success") {{ count }}
	v-row
		v-col(
			cols="auto"
		)
			v-btn(
				color="error"
				:disabled='count === 0'
				@click='decrement'
			) -
		v-col(
			cols="auto"
		)
			v-btn(
				color="primary"
				@click='increment'
			) +
</template>

<script>

export default {
	computed: mapGetters({
		count: 'count'
	}),
	methods: mapMutations({
		increment: 'increment',
		decrement: 'decrement'
	})
};
</script>