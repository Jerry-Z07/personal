// 数据预加载服务
// 在应用启动时后台加载所有标签的数据

import { cacheManager, CACHE_KEYS } from './cacheManager.js';
import { API_BASE_URL } from './api.js';

/**
 * 预加载Bilibili数据
 */
const preloadBilibiliData = async () => {
  try {
    // 并行请求用户信息和视频列表
    const [userResponse, videosResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/v1/social/bilibili/userinfo?uid=401175768`),
      fetch(`${API_BASE_URL}/v1/social/bilibili/archives?mid=401175768`)
    ]);

    if (!userResponse.ok || !videosResponse.ok) {
      throw new Error('获取Bilibili数据失败');
    }

    const [userData, videosData] = await Promise.all([
      userResponse.json(),
      videosResponse.json()
    ]);

    // 缓存数据
    cacheManager.set(CACHE_KEYS.BILIBILI_USER, userData);
    cacheManager.set(CACHE_KEYS.BILIBILI_VIDEOS, videosData.videos.slice(0, 8));

    console.log('✓ Bilibili数据预加载完成');
  } catch (error) {
    console.error('✗ Bilibili数据预加载失败:', error);
  }
};

/**
 * 预加载博客数据
 */
const preloadBlogData = async () => {
  try {
    const feedUrl = import.meta.env.MODE === 'development' 
      ? '/blog-feed/' 
      : 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://blog.078465.xyz/feed/');
    
    const response = await fetch(feedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      },
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    
    // 解析 XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // 提取 image 信息
    const imageNode = xmlDoc.querySelector('image');
    const blogTitle = imageNode?.querySelector('title')?.textContent || '博客';
    const blogLink = imageNode?.querySelector('link')?.textContent || '';
    
    // 提取前 5 个 item
    const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      const shortDescription = description.length > 100 
        ? description.substring(0, 100) + '...' 
        : description;
      
      return { title, link, description: shortDescription };
    });
    
    const blogData = { blogTitle, blogLink, items };
    
    // 缓存数据
    cacheManager.set(CACHE_KEYS.BLOG_FEED, blogData);

    console.log('✓ 博客数据预加载完成');
  } catch (error) {
    console.error('✗ 博客数据预加载失败:', error);
  }
};

/**
 * 预加载所有数据
 * 在后台并行加载所有标签的数据，不阻塞UI渲染
 */
export const preloadAllData = () => {
  // 使用 Promise.allSettled 确保即使某个请求失败也不影响其他请求
  Promise.allSettled([
    preloadBilibiliData(),
    preloadBlogData()
  ]).then((results) => {
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    console.log(`数据预加载完成: ${successCount}/${results.length} 成功`);
  });
};
