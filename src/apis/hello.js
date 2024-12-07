import {
	GET,
	POST
} from "../utils/request";

export default {
	// GET请求Hello接口下的test接口
	getTest: () => GET({
		// 请求地址，对应的网址是：https://teach.dracowyn.com/api/hello/test
		// 代理地址：
		url: '/hello/test'
	}),
	// POST请求Hello接口下的index接口
	postIndex: (data) => POST({
		// 请求地址，对应的网址是：https://teach.dracowyn.com/api/hello/index
		url: '/hello/index',
		// 请求参数
		params: data
	})
}