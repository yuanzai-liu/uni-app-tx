<template>
	<wd-search 
	v-model="search" 
	@search="toSearch" 
	@clear="toSearch" 
	@cancel="toSearch" 
	maxlength="10"
	placeholder-left
	placeholder="请输入分类名称" 
	cancel-txt="搜索"/>
	<view>
		<view @click.stop="closeOutside" 
		v-for="(item,index) in typeList"  
		:key='index' 
		class="wd-cell-group">
		  <wd-swipe-action>
		    <wd-cell :title="item.name"/>
		    <template #right>
		      <view class="action">
		        <view class="button" style="background: #FFB300;" 
				@click="toEdit(item.id)">编辑</view>
		        <view class="button" style="background: #E2231A;" 
				@click="toDel(item.id)">删除</view>
		      </view>
		    </template>
		  </wd-swipe-action>  
		</view>
	</view>
	<wd-loadmore 
		:state="loading" 
		@reload="loadMore" 
		error-text="点击加载更多"/>
	<wd-toast/>
	<!-- 引入MessageBox弹窗 -->
	<wd-message-box/>
	<wd-tabbar v-model="tabbar" fixed bordered safeAreaInsetBottom placeholder>
	  <wd-tabbar-item title="首页" icon="home" name="home" @click="toIndex()"/>
	  <wd-tabbar-item title="分类" icon="cart" name="type" @click="toType()"/>
	  <wd-tabbar-item title="我的" icon="user" name="profile" @click="toProfile()" />
	</wd-tabbar>
</template>

<script setup>
	import { useToast, useQueue,useMessage } from 'wot-design-uni';
	// 引入分类接口
	import typeApi from '../../apis/type';
	import { ref } from 'vue';
	import { 
		onNavigationBarButtonTap, 
		onPullDownRefresh,
		onReachBottom,
		onShow } from '@dcloudio/uni-app';
	// 设置底部导航栏高亮
	const tabbar=ref('type');
	
	const { closeOutside } = useQueue()
	const toast = useToast()
	//引入MessageBox弹窗
	const message=useMessage();
	// 分类列表数据
	const typeList=ref([])
	// 页码
	const page=ref(1);
	// 每页数量
	const limit=ref(10);
	// 总数
	const total=ref(0);
	// 搜索关键词
	const search=ref('');
	// 加载状态
	const loading=ref('loading');
	// 获取分类列表
	const getTypeList=async()=>{
		// 设置加载状态
		loading.value='loading';
		// 封装请求参数
		const data={
			page:page.value,
			limit:limit.value,
			search:search.value
		}
		await typeApi.index(data)
		.then(result=>{
			// 判断是否有数据
			if(typeList.value.length>0){
				// 如果有数据,追加数据
				typeList.value=typeList.value.concat(result.data.list);
			}else{
				// 如果没有,直接赋值
				typeList.value=result.data.list;
			}
			// 设置总数
			total.value=result.data.list
		})
		.catch(error=>{
			console.log(error);
			// 提示错误信息
			toast.error({
				msg:error.data.msg,
				duration:3000,
			})
		})

	}
	// 页面显示时获取数据
	onShow(async ()=>{
		// 获取分类列表
		await getTypeList();
		console.log('分类列表',typeList.value);
	})
	
	// 自定义导航栏上的按钮行为
	onNavigationBarButtonTap(()=>{
		// 跳转到添加分类页面
		uni.navigateTo({
			url:"/pages/type/add"
		})
	})
	// 删除分类
	const toDel=async(id)=>{
		message.confirm({
			title:'提示',
			msg:'确定删除该分类吗',
		})
		.then(async ()=>{
			const data={
				id
			}
			// 调用删除接口
			await typeApi.del(data)
			.then(result=>{
				// 提示删除成功
				toast.success({
					msg:result.msg,
					duration:1500,
					closed(){
						// 动态删除列表中的数据
						typeList.value=typeList.value.filter(item=>item.id!==id)
					}
				})
			})
			.catch(error=>{
				console.error(error)
				// 提示错误信息
				toast.error({
					msg:error.data.msg,
					duration:3000,
				})
			})
		})
		.catch(()=>{
			console.log('取消删除')
		})
	}
	// 滑动到底部加载更多
	onReachBottom(()=>{
		loadMore();
	})
	
	// 加载更多
	const loadMore=async ()=>{
		// 判断是否还有数据
		if(typeList.value.length<total.value){
			// 设置加载状态为loading
			loading.value='loading';
			// 页面加一
			page.value++;
			// 执行加载更多
			await getTypeList();
			// 如果没有更多的数据了
			if(typeList.value.length>=total.value){
				// 设置加载状态为finished
				loading.value='finished';
			}else{
				//如果还有则加载更多
				loading.value='error'
			}
		}
	}
	// 搜索
	const toSearch= async ()=>{
		// 重置页码
		page.value=1;
		// 重置总数
		total.value=0;
		// 清空分类列表数据
		typeList.value=[];
		// 重置加载状态
		loading.value='loading';
		// 重新获取数据
		await getTypeList();
		// 判断是否有更多搜索结果
		if(typeList.value.length>=total.value){
			// 如果没有更多了就显示已加载完毕
			loading.value='finished';
		}else{
			// 如果还有救显示加载更多
			loading.value='error';
		}
	}
	// 下拉刷新
	onPullDownRefresh( async ()=>{
		// 清空分类数据列表
		typeList.value=[];
		// 重置页码
		page.value=1;
		// 重置加载状态
		loading.value='loading';
		// 重新获取数据
		await getTypeList();
		// 判断是否有更多搜索结果
		if(typeList.value.length>=total.value){
			// 如果没有更多了就显示已加载完毕
			loading.value='finished';
		}else{
			// 如果还有救显示加载更多
			loading.value='error';
		}
		// 关闭下拉刷新
		uni.stopPullDownRefresh();
	})
	// 编辑分类
	const toEdit=(id)=>{
		// 跳转到编辑页面
		uni.navigateTo({
			url:'/pages/type/edit?id='+id
		})
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

<style scoped lang="scss">
	.action {
	  height: 100%;
	}
	.button {
	  display: inline-block;
	  padding: 0 11px;
	  height: 100%;
	  color: white;
	  line-height: 42px;
	}       
</style>
