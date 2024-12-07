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
const toast=useToast();
// 表单数据
const model=reactive({
	typeName:'',
});
const form=ref();

const handleSubmit=()=>{
  form.value
    .validate()
    .then(async({ valid }) => {
      if (valid) {
        const data={
			name:model.typeName
		}
		await typeApi.add(data)
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
</script>

<style scoped lang="scss">
	.footer {
	  padding: 12px;
	}       
</style>
