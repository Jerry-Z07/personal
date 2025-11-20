/**
 * 统一的API工具模块
 * 整合所有数据获取逻辑，消除代码重复，确保一致性和可维护性
 * 
 * @author Assistant
 * @date 2025-01-01
 */

// 常量配置
const BILIBILI_USER_ID = '401175768';
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟

/**
 * 环境检测工具
 * @returns {boolean} 是否为开发环境
 */
const isDevelopment = () => import.meta.env.MODE === 'development';

/**
 * 构建Bilibili API URL
 * @param {string} type - API类型：'userinfo' 或 'archives'
 * @returns {string} 完整的API URL
 */
export const buildBilibiliApiUrl = (type) => {
  const baseUrl = 'https://uapis.cn/api/v1/social/bilibili';
  const userId = BILIBILI_USER_ID;
  
  let apiPath;
  if (type === 'userinfo') {
    apiPath = `/userinfo?uid=${userId}`;
  } else if (type === 'archives') {
    apiPath = `/archives?mid=${userId}`;
  } else {
    throw new Error(`未知的Bilibili API类型: ${type}`);
  }

  if (isDevelopment()) {
    return `/api/v1/social/bilibili${apiPath}`;
  } else {
    const targetUrl = `${baseUrl}${apiPath}`;
    return `https://cors1.078465.xyz/v1/proxy/?quest=${encodeURIComponent(targetUrl)}`;
  }
};

/**
 * 构建Blog API URL
 * @returns {string} 完整的Blog API URL
 */
export const buildBlogApiUrl = () => {
  const blogUrl = 'https://blog.078465.xyz/feed/';
  
  if (isDevelopment()) {
    return '/blog-feed/';
  } else {
    return `https://cors1.078465.xyz/v1/proxy/?quest=${encodeURIComponent(blogUrl)}`;
  }
};

/**
 * 通用HTTP请求工具
 * @param {string} url - 请求URL
 * @param {Object} options - 请求选项
 * @returns {Promise<Response>} fetch响应对象
 */
const performRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/xml, text/xml, */*',
      ...options.headers
    },
    mode: 'cors',
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};

/**
 * 获取Bilibili用户信息
 * @returns {Promise<Object>} Bilibili用户信息
 */
export const fetchBilibiliUserInfo = async () => {
  const url = buildBilibiliApiUrl('userinfo');
  const response = await performRequest(url);
  return response.json();
};

/**
 * 获取Bilibili视频列表
 * @returns {Promise<Array>} Bilibili视频列表
 */
export const fetchBilibiliVideos = async () => {
  const url = buildBilibiliApiUrl('archives');
  const response = await performRequest(url);
  const data = await response.json();
  return data.videos.slice(0, 8); // 限制返回8个视频
};

/**
 * 获取完整的Bilibili数据
 * @returns {Promise<Object>} 包含用户信息和视频列表的对象
 */
export const fetchBilibiliData = async () => {
  try {
    const [userInfo, videos] = await Promise.all([
      fetchBilibiliUserInfo(),
      fetchBilibiliVideos()
    ]);

    return {
      userInfo,
      videos
    };
  } catch (error) {
    console.error('获取Bilibili数据失败:', error);
    throw new Error('获取Bilibili数据失败');
  }
};

/**
 * 解析Blog RSS Feed
 * @param {string} xmlText - RSS XML文本
 * @returns {Object} 解析后的博客数据
 */
const parseBlogRssFeed = (xmlText) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

  // 检查解析错误
  const parserError = xmlDoc.querySelector('parsererror');
  if (parserError) {
    throw new Error('解析RSS Feed失败');
  }

  const imageNode = xmlDoc.querySelector('image');
  const blogTitle = imageNode?.querySelector('title')?.textContent || '博客';
  const blogLink = imageNode?.querySelector('link')?.textContent || '';

  // 提取博客文章项
  const items = Array.from(xmlDoc.querySelectorAll('item'))
    .slice(0, 5) // 限制返回5篇文章
    .map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // 截取描述文本，避免过长
      const shortDescription = description.length > 100 
        ? description.substring(0, 100) + '...' 
        : description;
      
      return { title, link, description: shortDescription };
    });

  return { blogTitle, blogLink, items };
};

/**
 * 获取Blog数据
 * @returns {Promise<Object>} 博客数据对象
 */
export const fetchBlogData = async () => {
  try {
    const url = buildBlogApiUrl();
    const response = await performRequest(url);
    const text = await response.text();
    
    return parseBlogRssFeed(text);
  } catch (error) {
    console.error('获取Blog数据失败:', error);
    throw new Error('获取Blog数据失败');
  }
};

/**
 * React Query配置对象
 * 用于统一配置所有查询的缓存和重试策略
 */
export const queryConfig = {
  staleTime: CACHE_DURATION,
  gcTime: CACHE_DURATION,
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnReconnect: 'always'
};

// 导出常用常量
export { BILIBILI_USER_ID, CACHE_DURATION };