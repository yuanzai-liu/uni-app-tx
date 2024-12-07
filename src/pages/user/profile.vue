<template>
	<view class="layout">
		<view class="avatar" v-if='userInfo.id'>
			<wd-img
				 :width="100"
				 :height="100"
				  round
				  :src="avatar"
			/>
			<view class="username">{{userInfo.username}}</view>
			<view class="username">{{userInfo.mobile}}</view>
		</view>
		<view class="avatar" v-else>
			<wd-img
				 :width="100"
				 :height="100"
				  round
				  src="/static/logo.png"
			/>
			<h3>未登录</h3>
			<wd-button @click="toLogin()">去登陆</wd-button>
		</view>
		<wd-cell-group style="margin-top: 30rpx;width: 100%;">
		  <wd-cell title="修改头像" is-link to="/pages/user/avatar" />
		  <wd-cell title="修改资料" is-link to="/pages/user/mod" />
		  <wd-cell title="修改密码" is-link to="/pages/user/password" />
		  <wd-cell title="注销登录" is-link @click="toLogout()" />
		</wd-cell-group>
	</view>
	<wd-tabbar v-model="tabbar" fixed bordered safeAreaInsetBottom placeholder>
	  <wd-tabbar-item title="首页" icon="home" name="home" @click="toIndex()" />
	  <wd-tabbar-item title="分类" icon="cart" name="type" @click="toType()" />
	  <wd-tabbar-item title="我的" icon="user" name="profile" @click="toProfile()" />
	</wd-tabbar>
</template>

<script setup>
	import {ref} from 'vue';
	import userApi from '../../apis/user';
	import { onLoad, onShow } from '@dcloudio/uni-app';
	// 从本地存储读取用户信息
	const localUserInfo=JSON.parse(uni.getStorageSync('user')||'{}');
	// 底部导航栏高亮
	const tabbar=ref('profile');
	// 定义为响应式用户对象
	const userInfo=ref(localUserInfo);
	// 用户头像
	const avatar=ref('');
	// 判断用户对象是否有头像
	if(userInfo.avatar){
		// 如果有则直接给头像对象赋值用户对象里边的头像
		avatar.value=userInfo.avatar;
	}else{
		// 如果没有就直接使用本地logo作为头像
		avatar.value='/static/logo.png'
	}
	
	const toLogin = () =>{
		uni.navigateTo({
			url:'/pages/user/login'
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
		
		// 重新刷新
		location.reload();
		// 
	}
	// 跳转到首页
	const toIndex=()=>{
		uni.switchTab({
			url:"/pages/index/index"
		})
	}
	// 跳转到分类页面
	const toType=()=>{
		uni.switchTab({
			url:'/pages/type/index'
		})
	}
	// 跳转到个人资料
	const toProfile=()=>{
		uni.switchTab({
			url:'/pages/user/profile'
		})
	}

</script>

<style scoped lang="scss">
     .layout{
		 display: flex;
		 flex-direction: column;
		 align-items: center;
		 padding: 0 20rpx;
		 
		 .avatar{
			 // 外边距
			 margin-top: 30rpx;
			 display: flex;
			 flex-direction: column;
			 align-items: center;
			 // 父盒子里边元素的间距
			 gap: 20rpx;
		 }
	 }
</style>
