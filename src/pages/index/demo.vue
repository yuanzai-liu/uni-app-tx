<template>
	<view class="layout">
		<view class="box1" hover-class="box-hover" hover-stay-time="1000" hover-start-time="500">box1</view>
		<view class="box2" hover-class="box-hover" hover-stay-time="2000">box2</view>
		<view class="box3" @click="alterBox()">box3</view>
	</view>
</template>

<script setup>
	const alterBox = () => {
		uni.showToast({
			title: '点击了box3',
			icon: 'none'
		})
	}
</script>

<style scoped lang="scss">
.layout {
	display: flex;
	// 主轴方向改为纵向
	flex-direction: column;
	// 让子元素在主轴上居中
	align-items: center;
	// 让文字居中显示
	text-align: center;

	.box1 {
		width: 150px;
		height: 150px;
		background-color: coral;
	}

	.box2 {
		width: 200px;
		height: 200px;
		background-color: lightblue;
	}
	
	.box3 {
		width: 250px;
		height: 250px;
		background-color: tan;
	}
}

.box-hover {
	// 鼠标点击时的背景色
	background-color: greenyellow !important;
}
</style>