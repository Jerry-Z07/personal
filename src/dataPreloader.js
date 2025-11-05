// 数据预加载器 - 在后台静默预加载 Bilibili 和 Blog 数据

import cacheManager from './cacheManager';

// Bilibili API URL 构建函数
export const getBilibiliApiUrls = () => {
  const getUserUrl = () => {
    if (import.meta.env.MODE === 'development') {
      return '/api/v1/social/bilibili/userinfo?uid=401175768';
    } else {
      const targetUrl = 'https://uapis.cn/api/v1/social/bilibili/userinfo?uid=401175768';
      return 'https://cors1.078465.xyz/v1/proxy/?quest=' + encodeURIComponent(targetUrl);
    }
  };
  
  const getVideosUrl = () => {
    if (import.meta.env.MODE === 'development') {
      return '/api/v1/social/bilibili/archives?mid=401175768';
    } else {
      const targetUrl = 'https://uapis.cn/api/v1/social/bilibili/archives?mid=401175768';
      return 'https://cors1.078465.xyz/v1/proxy/?quest=' + encodeURIComponent(targetUrl);
    }
  };
  
  return { userUrl: getUserUrl(), videosUrl: getVideosUrl() };
};

// Blog API URL 构建函数
export const getBlogApiUrl = () => {
  return import.meta.env.MODE === 'development' 
    ? '/blog-feed/' 
    : 'https://cors1.078465.xyz/v1/proxy/?quest=' + encodeURIComponent('https://blog.078465.xyz/feed/');
};

// 获取 Bilibili 数据
export const fetchBilibiliData = async () => {
  const { userUrl, videosUrl } = getBilibiliApiUrls();
  
  const [userResponse, videosResponse] = await Promise.all([
    fetch(userUrl),
    fetch(videosUrl)
  ]);
  
  if (!userResponse.ok || !videosResponse.ok) {
    throw new Error('获取Bilibili数据失败');
  }
  
  const userData = await userResponse.json();
  const videosData = await videosResponse.json();
  
  return {
    userInfo: userData,
    videos: videosData.videos.slice(0, 8)
  };
};

// 获取 Blog 数据
export const fetchBlogData = async () => {
  const feedUrl = getBlogApiUrl();
  
  const response = await fetch(feedUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/xml, text/xml, */*'
    },
    mode: 'cors'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');
  
  const imageNode = xmlDoc.querySelector('image');
  const blogTitle = imageNode?.querySelector('title')?.textContent || '博客';
  const blogLink = imageNode?.querySelector('link')?.textContent || '';
  
  const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5).map(item => {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    const shortDescription = description.length > 100 
      ? description.substring(0, 100) + '...' 
      : description;
    return { title, link, description: shortDescription };
  });
  
  return { blogTitle, blogLink, items };
};

// Bilibili 数据预加载
export const preloadBilibiliData = async () => {
  if (cacheManager.has('bilibili')) {
    return;
  }

  try {
    const data = await fetchBilibiliData();
    cacheManager.set('bilibili', data);
  } catch (err) {
    console.error('预加载Bilibili数据失败:', err);
  }
};

// Blog 数据预加载
export const preloadBlogData = async () => {
  if (cacheManager.has('blog')) {
    return;
  }

  try {
    const data = await fetchBlogData();
    cacheManager.set('blog', data);
  } catch (err) {
    console.error('预加载Blog数据失败:', err);
  }
};

// 预加载所有数据
export const preloadAllData = async () => {
  await Promise.all([
    preloadBilibiliData(),
    preloadBlogData()
  ]);
};
