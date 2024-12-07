<template>
	<view class="layout">
		<view class="logo">
			<image src="/static/logo.png" mode="widthFix"></image>
			<h2>登录系统</h2>
		</view>
		<wd-form ref="form" :model="model">
		  <wd-cell-group border>
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
		  </wd-cell-group>
		  <view class="link" @click="toRegister()">没有账号？去注册</view>
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
		mobile:'15706630041',
		password:'123456',
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
	const toRegister=()=>{
		uni.navigateTo({
			url:'/pages/user/register'
		})
	}
	
	
	// 提交表单
	const handleSubmit=()=>{
		// 校验表单
		form.value.validate()
		// 校验成功
		.then(async ({valid})=>{
			if(valid){
				const data={
					mobile:model.mobile,
					password:model.password,
					keep:true
				}
				await userApi.login(data)
				.then(result => {
					// 转换为JSON字符串
					let userInfo=JSON.stringify(result.data);
					// 存储用户信息
					uni.setStorageSync('user',userInfo);
					// 登录成功
					toast.success({
						msg:result.msg,
						// 提示时间1.5s
						duration:1500,
						// 提示结束之后的回调函数
						closed(){
							uni.switchTab({
								url:'/pages/index/index'
							})
						}
					})
				})
			}
		})
		// 出错之后的处理
		.catch((error)=>{
			toast.error({
				msg:error.data.msg
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
