<script setup>
	import { RouterView } from 'vue-router';
	import { useAccountData } from './stores/studentManage';

	const { studentSwitch } = useAccountData();
</script>

<template>
	<div class="container">
		<FailPopUp v-if="studentSwitch.failPopUp" />
		<RouterView />
	</div>
</template>

<style lang="scss" scoped>
	.container {
		position: relative;
		width: calc(1920 / 1080 * (var(--basic-size) * 100));
		height: calc(1080 / 1080 * (var(--basic-size) * 100));
	}
</style>
