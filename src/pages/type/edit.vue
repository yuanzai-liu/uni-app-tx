<template>
	<view>
		<wd-form ref="form" :model="model">
		  <wd-cell-group border>
		    <wd-input
		      label="分类名称"
		      label-width="100px"
		      prop="typeName"
		      clearable
		      v-model="model.typeName"
		      placeholder="请输入分类名"
		      :rules="[{ required: true, message: '请填写分类名' }]"
		    />
		  </wd-cell-group>
		  <view class="footer">
		    <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
		  </view>
		</wd-form>
	</view>
	<wd-toast/>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useToast } from "wot-design-uni"
// 引入分类接口
import typeApi from '../../apis/type';
import { onLoad, onShow } from '@dcloudio/uni-app';
const toast=useToast();
// 分类id
const typeId=ref(0);
onLoad((options)=>{
	// 获取分类id
	typeId.value=options.id;
	console.log("分类id:"+typeId.value)
})
// 表单数据
const model=reactive({
	typeName:'',
});
// 表单对象
const form=ref();
// 提交表单
const handleSubmit=()=>{
  form.value
    .validate()
    .then(async({ valid }) => {
      if (valid) {
		  // 封装请求参数
        const data={
			// 分类id
			id:typeId.value,
			// 分类名称
			name:model.typeName
		}
		// 请求编辑分类接口
		await typeApi.edit(data)
		.then(result=>{
			toast.success({
				msg:result.msg,
				duration:1500,
				closed(){
					uni.switchTab({
						url:"/pages/type/index"
					})
				}
			})
		})
      }
    })
    .catch((error) => {
      console.log(error, 'error')
	  toast.error({
		  msg:error.data.msg,
	  })
    })
}
// 页面加载完成后
onShow( async()=>{
	// 封装请求参数
	const data = {
		id:typeId.value
	}
	// 获取分类详情信息
	await typeApi.info(data)
	.then(result=>{
		model.typeName=result.data.name;
	})
	// 请求发生错误时的处理
	.catch(error=>{
		console.log(error)
		toast.error({
			msg:error.data.msg,
			duration:3000,
		})
	})
})
</script>

<style scoped lang="scss">
	.footer {
	  padding: 12px;
	}       
</style>

