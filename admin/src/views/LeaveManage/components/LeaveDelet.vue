<script setup>
	import { socket } from '../../../socket.js';
	const props = defineProps(['deleteData', 'getNewData']);
	const emit = defineEmits(['close']);
	function deleteLeave() {
		socket.emit('absent-delete', { id: props.deleteData.id });
		socket.on('absent-delete-response', (res) => {
			if (res.code === '0001') {
				socket.emit('absent', {
					page: 1,
					pageSize: 10,
					sort: 'DESC',
					sortTarget: 'start_date',
					column: {},
				});
				emit('close', false);
			}
		});
	}
</script>

<template>
	<div class="popUpBg flex_center">
		<div class="container">
			<header class="flex_center">
				<h1>請假刪除</h1>
			</header>
			<section class="flex_center">
				<table>
					<tr height="40">
						<td align="center">姓名</td>
						<td align="center">起始日期</td>
						<td align="center">起始時間</td>
						<td align="center">結束日期</td>
						<td align="center">結束時間</td>
					</tr>
					<tr height="40">
						<td align="center">{{ props.deleteData.name }}</td>
						<td align="center">{{ props.deleteData.startDate }}</td>
						<td align="center">{{ props.deleteData.startTime }}</td>
						<td align="center">{{ props.deleteData.endDate }}</td>
						<td align="center">{{ props.deleteData.endTime }}</td>
					</tr>
				</table>
			</section>
			<footer class="flex_center">
				<button class="close" @click="emit('close')">取消</button>
				<button @click="deleteLeave">刪除</button>
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
		width: size(900);
		height: size(500);
		background-color: #ffffff;
		border-radius: size(4);
	}

	header {
		width: 100%;
		height: 20%;
	}

	header h1 {
		font-size: 18px;
		font-weight: 700;
		line-height: 22px;
	}

	section {
		width: 100%;
		height: 60%;
	}

	table,
	th,
	td {
		border: 1px solid #c5c5c5;
		border-collapse: collapse;
		font-size: 16px;
		font-weight: 500;
		line-height: 22px;
	}

	td {
		width: size(140);
	}

	footer {
		width: 100%;
		height: 20%;
	}

	button {
		padding: size(9) size(20);
	}

	.close {
		margin-right: size(55);
		background-color: #ffffff;
		border: 1px solid #000000;
		border-radius: 4px;
		color: #000000;
	}
</style>
