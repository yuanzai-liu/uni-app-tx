import {
	GET,
	POST
} from "../utils/request";

export default {
	// 登录接口
	login:(data)=>POST({
		url:'/card.user/login',
		params:data
	}),
	// 注册接口
	register:(data)=>POST({
		url:'/card.user/register',
		params:data
	}),
	// 注销登录接口
	logout:(data)=>POST({
		url:'/card.user/logout',
		params:data
	}),
}