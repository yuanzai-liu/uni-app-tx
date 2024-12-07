<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
		<br />
		<!-- <view class="title">Count：{{ count }}</view> -->
		<!-- <view class="title">Count x Count：{{ count*count }}</view> -->
		<!-- <button @click="countAdd()">Count++</button> -->
		<!-- <button @click="countRe()">Count--</button> -->
		<!-- <button @click="toDemo()">跳转到Demo页面</button> -->
		<button @click="toLogin()">跳转到登陆页面</button><br />
		<button @click="getHelloText()">发起Get请求</button><br />
		<button @click="toLogout()">注销登录</button><br />
	</view>
	<wd-tabbar v-model="tabbar" fixed bordered safeAreaInsetBottom placeholder>
	  <wd-tabbar-item title="首页" icon="home" name="home" @click="toIndex()" />
	  <wd-tabbar-item title="分类" icon="cart" name="type" @click="toType()" />
	  <wd-tabbar-item title="我的" icon="user" name="profile" @click="toProfile()" />
	</wd-tabbar>
</template>

<script setup>
	import { ref } from 'vue';
	// 引入helloapi
	import helloApi from '../../apis/hello';
	// 导入用户接口
	import userApi from '../../apis/user';
	import { onShow } from '@dcloudio/uni-app';
	// 设置底部导航栏高亮
	const tabbar=ref('home');
	// 定义一个变量 title
	const title = ref('Hello World');

	// 定义一个变量 count
	const count = ref(0);

	// 定义一个方法 countAdd
	const countAdd = () => {
		// 让 count 加 1
		count.value++;
	}

	// 定义一个方法 countRe
	const countRe = () => {
		// 让 count 减 1
		count.value--;
	}
	
	// 定义一个方法跳转到Demo页面
	const toDemo = ()=> {
		uni.navigateTo({
			url: '/pages/index/demo'
		})
	}
	
	// 跳转到登陆页面
	const toLogin = () =>{
		uni.navigateTo({
			url:'/pages/user/login'
		})
	}
	
	// 通过get请求获取数据
	const getHelloText=async()=>{
		await helloApi.getTest()
		.then(result=>{
			uni.showToast({
				title:result.msg,
				icon:'none'
			})
		})
	}
	// 注销登录
	const toLogout=async()=>{
		//读取本地用户信息
		let userInfo=JSON.parse(uni.getStorageSync('user')||'{}');
		//如果用户信息不存在，提示用户未登录
		if(!userInfo.id){
			uni.showToast({
				title:'未登录',
				icon:'error'
			})
			return;
		}
		const data={
			refreshToken:userInfo.refreshToken
		}
		// 调用注销登录节后
		await userApi.logout();
		// 删除本地存储的用户信息
		uni.removeStorageSync('user');
		uni.showToast({
			title:'注销成功',
			icon:'success'
		})
	}
	onShow(()=>{
		let userInfo=JSON.parse(uni.getStorageSync('user')||'{}');
		if(userInfo.id){
			// 修改title
			title.value='Hello，'+userInfo.username;
		}
	})
	
	// 跳转到分类页面
	const toType=()=>{
		uni.switchTab({
			url:'/pages/type/index'
		})
	}
	// 跳转到首页
	const toIndex=()=>{
		uni.switchTab({
			url:"/pages/index/index"
		})
	}
	// 跳转到个人资料
	const toProfile=()=>{
		// uni.switchTab({
		// 	url:'/pages/user/profile',
		// })
		// 刷新用户个人资料页面
		uni.reLaunch({
		        url: '/pages/user/profile',
		        success: function () {
		            // 跳转到个人资料页
		            uni.switchTab({
		                url: '/pages/user/profile',
		            });
		        }
		    });
	}
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>