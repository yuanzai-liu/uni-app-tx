<template>
	<view class="layout">
		<view class="logo">
			<image src="/static/logo.png" mode="widthFix"></image>
			<h2>注册系统</h2>
		</view>
		<wd-form ref="form" :model="model">
		  <wd-cell-group border>
			  <wd-input
			    label="用户名"
			    label-width="100px"
			    prop="username"
			    clearable
			    v-model="model.username"
			    placeholder="请输入用户名"
			    :rules="[{ 
			  	  required: true, 
			  	  message: '请填写用户名'
			  	}]"
			  />
		    <wd-input
		      label="手机号"
		      label-width="100px"
		      prop="mobile"
		      clearable
		      v-model="model.mobile"
		      placeholder="请输入手机号"
		      :rules="[{ 
				  required: true, 
				  message: '请填写手机号',
				  validator:validateMobile
				}]"
		    />
		    <wd-input
		      label="密码"
		      label-width="100px"
		      prop="password"
		      show-password
		      clearable
		      v-model="model.password"
		      placeholder="请输入密码"
		      :rules="[{ required: true, message: '请填写密码' }]"
		    />
			<wd-input
			  label="确认密码"
			  label-width="100px"
			  prop="confirmPassword"
			  show-password
			  clearable
			  v-model="model.confirmPassword"
			  placeholder="请输入确认密码"
			  :rules="[{ required: true, message: '两次密码不一致',validator:validateConfirmPassword }]"
			/>
		  </wd-cell-group>
		  <view class="link" @click="toLogin()">已有账号？去登录</view>
		  <view class="footer">
		    <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
		  </view>
		</wd-form>
	</view>
	<!-- 引入toast组件,给toast组件作为嵌入点使用 -->
	<wd-toast />
</template>

<script setup>
import { reactive,ref } from 'vue';
import { useToast } from 'wot-design-uni';
import userApi from '../../apis/user';
 		// 生命一个响应式对象model
	const model=reactive({
		username:'黎明',
		mobile:'13711111111',
		password:'123456',
		confirmPassword:'123456'
	});
	
	// 生命表单对象
	const form=ref();
	
	// 声明通知对象
	const toast=useToast();
	
	// 校验手机号
	const validateMobile=(val)=>{
		const reg=/^1[3-9]\d{9}$/
		return reg.test(val)
	}
	
	// 校验两次密码是否一致
	const validateConfirmPassword=(val)=>{
		// 如果两次密码不一致，返回false
		return val===model.password;
	}
	
	// 去登录
	const toLogin=()=>{
		uni.navigateTo({
			url:'/pages/user/login'
		})
	}
	
	// 提交表单
	const handleSubmit=()=>{
		// 校验表单
		form.value.validate()
		// 校验成功
			.then( async({valid})=>{
				if(valid){
					await userApi.register(model)
					.then(result=>{
						let userInfo=JSON.stringify(result.data);
						uni.setStorageSync('user',userInfo);
						toast.success({
							msg:result.msg,
							duration:2000,
							closed(){
								uni.switchTab({
									url:'/pages/index/index'
								})
							}
						})
					})
				}
			})
		// 校验失败
		.catch((error)=>{
			toast.error({
				msg:error
			})
		})
	}
</script>

<style scoped lang="scss">
	       .layout{
			   display: flex;
			   flex-direction: column;
			   justify-content: center;
			   align-items: center;
			   height: 90vh;
			   padding: 0 20rpx;
			   
			   .logo{
				   image{
					   width: 300rpx;
					   height: 300rpx;
				   }
				   
				   h2{
					   text-align: center;
					   font-size: 50rpx;
					   margin: 20rpx auto;
				   }
			   }
			   .wd-form{
				   width: 100%;
			   }
			   .wd-input{
				   margin-bottom: 20rpx;
			   }
			   .link{
				   text-align: right;
				   margin-bottom: 20rpx;
				   color: #007aff;
			   }
		   }
</style>
