<template>
	<view>
		<wd-cell-group border >
		    <wd-input
		      label="原密码"
		      label-width="100px"
		      show-password
		      clearable
		      placeholder="请输入密码"
		      :rules="[{ required: true, message: '请填写原密码' }]"
		    />
			<wd-input
			  label="新密码"
			  label-width="100px"
			  show-password
			  clearable
			  placeholder="请输入密码"
			  :rules="[{ required: true, message: '请填写新密码' }]"
			/>
			<wd-input
			  label="确认密码"
			  label-width="100px"
			  show-password
			  clearable
			  placeholder="请输入密码"
			  :rules="[{ required: true, message: '请确认密码' }]"
			/>
		</wd-cell-group>
		<wd-button type="primary" size="large" block>提交</wd-button>
	</view>
</template>

<script setup>
	
</script>

<style>
     
</style>
