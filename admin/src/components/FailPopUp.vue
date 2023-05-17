<script setup>
	import { useAccountData } from '../stores/studentManage';

	const { studentSwitch } = useAccountData();
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>操作失敗</h1>
			</header>
			<section class="flex_center">
				<img src="../assets/img/erroImg.png" alt="失敗" />
			</section>
			<footer class="flex_center">
				<button @click="studentSwitch.failPopUp = !studentSwitch.failPopUp">
					確認
				</button>
			</footer>
		</div>
	</div>
</template>

<style lang="scss" scoped>
	.popUpBg {
		position: fixed;
		margin: 0 auto;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		z-index: 999;
		background-color: rgba(217, 217, 217, 0.5);
	}

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		width: size(500);
		height: size(300);
		background-color: #ffffff;
		border-radius: size(4);
	}

	header {
		width: 100%;
		height: 20%;
	}

	header h1 {
		font-weight: 700;
		font-size: 18px;
		line-height: 22px;
	}

	section {
		width: 100%;
		height: 60%;
	}

	footer {
		width: 100%;
		height: 20%;
	}

	footer button {
		width: size(68);
		height: size(40);
	}
</style>
