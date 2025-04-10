// 引入请求
import { baseRequest }  from '@/request/request.js'

//接口示例
// export const getGlobalConfig = (data = {}) => baseRequest('/index/getBasicConfig', 'POST', data, 'global')

// 获取桌台列表
export const getTableList = (data = {}) => baseRequest('/stream/tableList', 'POST', data)

// 桌台信息
export const getTableInfoApi = (data = {}) => baseRequest('/stream/tableInfo', 'POST', data)

