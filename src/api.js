// API配置文件
const API_CONFIG = {
  // 开发环境使用代理
  development: {
    baseURL: '/api'
  },
  // 生产环境直接使用完整URL
  production: {
    baseURL: 'https://uapis.cn/api'
  }
};

// 获取当前环境的API配置
const getApiConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return API_CONFIG[env] || API_CONFIG.development;
};

export const API_BASE_URL = getApiConfig().baseURL;