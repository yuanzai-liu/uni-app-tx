import { defineConfig,loadEnv,} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

import Components from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'

export default ({ mode }) => {
	// 加载环境变量
	const env = loadEnv(mode, process.cwd());

	return defineConfig({
		// 为开发服务器配置自定义代理规则
		server: {
			proxy: {
				// 带选项写法：http://localhost:5173/h5api/api/hello/test -> https://teach.dracowyn.com/api/hello/tes
				"/h5api": {
					target: env.VITE_BASE_API_URL, // 代理地址
					changeOrigin: true, // 是否换源
					rewrite: (path) => path.replace(/^\/h5api/, ""),
				}
			}
		},
		plugins: [
			// make sure put it before `Uni()`
			Components({
					resolvers: [WotResolver()]
			}), uni()
		],
		esbuild: {
			// 去除console和debugger
			// drop: ['console', 'debugger'],
		},
	});
};