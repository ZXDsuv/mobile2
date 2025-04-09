// 引入请求
import { baseRequest }  from '@/request/request.js'

//接口示例
// export const getGlobalConfig = (data = {}) => baseRequest('/index/getBasicConfig', 'POST', data, 'global')
export const getTableList = (data = {}) => baseRequest('/handle/tableSocketTokenList', 'POST', data)
