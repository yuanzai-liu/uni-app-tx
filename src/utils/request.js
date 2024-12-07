import {
        createAlova
} from 'alova';
import AdapterUniapp from '@alova/adapter-uniapp';
import {
        useNotify
} from 'wot-design-uni';

// 消息通知组件
const {
        showNotify
} = useNotify();

// 获取env中的服务器地址
const server = import.meta.env.VITE_BASE_API_URL;

// 判断是否配置了服务器地址
if (!server) {
        uni.showToast({
                title: '请在.env文件中配置VITE_BASE_API_URL',
                icon: 'error'
        });
        throw new Error('请在.env文件中配置VITE_BASE_API_URL');
}

// 获取系统信息
const systemInfo = uni.getSystemInfoSync();

// 获取服务器地址
const apiHost = systemInfo.uniPlatform === 'web' ? '' : server;

// 获取代理地址
const apiProxy = systemInfo.uniPlatform === 'web' ? '/h5api' : '';

// 拼接服务器地址，如果是H5环境，需要加上代理地址，否则直接使用服务器地址
let apiUrl = apiHost + apiProxy;
// let apiUrl = server;

console.log('当前服务器地址：' + apiUrl);

// 创建alova实例
const alovaInstance = createAlova({
        // 设置服务器地址
        baseURL: apiUrl + '/api',
        // Uniapp适配器
        ...AdapterUniapp(),
        // 请求拦截器
        beforeRequest(method) {
                // 在请求头中添加accept，用于指定返回数据类型
                method.config.headers.Accept = 'application/json, text/plain, */*';
                // 在请求头中添加server=true，用于标识请求后端服务器
                method.config.headers.Server = 'true';
                // 获取用户登录信息
                const userInfo = JSON.parse(uni.getStorageSync('user') || '{}');
                // 获取用户token
                const userToken = userInfo ? userInfo.token : '';
                // 在请求头中添加user-token，用于标识用户身份
                if (userToken) {
                        method.config.headers['User-Token'] = userToken;
                }
        },
        // 响应拦截器
        responded: {
                // 成功响应
                onSuccess(response) {
                        // 判断响应状态码
                        if (response.data.code === 1) {
                                // 返回响应数据
                                return response.data;
                        } else {
                                // 弹出错误提示
                                showNotify({
                                        type: 'warning',
                                        message: response.data.msg,
                                })
                                // 返回Promise.reject()，中断Promise链
                                return Promise.reject(response);
                        }
                },
                // 失败响应
                onError(error) {
                        // 判断错误类型
                        const err = error.response || {
                                status: 0,
                        }

                        // 声明错误信息
                        let errorMessage;
                        switch (err.status) {
                                case 400:
                                        errorMessage = '错误请求';
                                        break;
                                case 401:
                                        errorMessage = '未授权，请重新登录';
                                        break;
                                case 403:
                                        errorMessage = '拒绝访问';
                                        break;
                                case 404:
                                        errorMessage = '请求错误,未找到该资源';
                                        break;
                                case 405:
                                        errorMessage = '请求方法未允许';
                                        break;
                                case 408:
                                        errorMessage = '请求超时';
                                        break;
                                case 500:
                                        errorMessage = '服务器端出错';
                                        break;
                                case 501:
                                        errorMessage = '网络未实现';
                                        break;
                                case 502:
                                        errorMessage = '网络错误';
                                        break;
                                case 503:
                                        errorMessage = '服务不可用';
                                        break;
                                case 504:
                                        errorMessage = '网络超时';
                                        break;
                                case 505:
                                        errorMessage = 'http版本不支持该请求';
                                        break;
                                default:
                                        errorMessage = `连接错误`;
                        }

                        // 弹出错误提示
                        uni.showToast({
                                title: errorMessage,
                                icon: 'error'
                        })
                        // 返回Promise.reject()，中断Promise链
                        return Promise.reject(err);
                }
        }
});


// 发起GET请求
export function GET(data = {}) {
        console.log('GET请求参数：', data);
        return alovaInstance.Get(data.url, data.params);
}

// 发起POST请求
export function POST(data = {}) {
        console.log('POST请求参数：', data);
        return alovaInstance.Post(data.url, data.params);
}

// 发起UPLOAD请求
export function UPLOAD(data = {}) {
        console.log('UPLOAD请求参数：', data);
        return alovaInstance.Post(data.url, data.params);
}