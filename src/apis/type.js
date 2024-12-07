import {
	GET,
	POST
} from "../utils/request";

export default {
	// 获取分类列表
	index: (data) => POST({
		url: '/card.type/index',
		params:data
	}),
	// 获取分类信息
	info: (data) => POST({
		url: '/card.type/info',
		params:data
	}),
	// 添加分类
	add: (data) => POST({
		url: '/card.type/add',
		params:data
	}),
	// 编辑分类
	edit: (data) => POST({
		url: '/card.type/edit',
		params:data
	}),
	// 删除分类
	del: (data) => POST({
		url: '/card.type/del',
		params:data
	}),
	// 获取所有分类
	list: (data) => POST({
		url: '/card.type/list',
		params:data
	}),
}