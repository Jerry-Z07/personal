import { useQuery } from '@tanstack/react-query';

// 获取Bilibili数据的自定义hook
export const useBilibiliData = () => {
  const fetchBilibiliData = async () => {
    const isDev = import.meta.env.MODE === 'development';
    const apiUrl = isDev ? '/api/bilibili/334961989' : `https://cors1.078465.xyz/v1/proxy/?quest=https://uapis.cn/bilibili/334961989`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Bilibili data');
    }
    return response.json();
  };

  return useQuery({
    queryKey: ['bilibiliData'],
    queryFn: fetchBilibiliData,
    staleTime: 300000, // 5分钟
  });
};

// 获取Blog数据的自定义hook
export const useBlogData = () => {
  const fetchBlogData = async () => {
    const isDev = import.meta.env.MODE === 'development';
    const apiUrl = isDev ? '/blog-feed/' : `https://cors1.078465.xyz/v1/proxy/?quest=https://blog.078465.xyz/feed`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/xml, text/xml, */*'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Blog data: HTTP error! status: ${response.status}`);
    }
    
    // 解析RSS格式数据
    const text = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // 检查解析错误
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Failed to parse RSS feed');
    }
    
    const imageNode = xmlDoc.querySelector('image');
    const blogTitle = imageNode?.querySelector('title')?.textContent || '博客';
    const blogLink = imageNode?.querySelector('link')?.textContent || '';
    
    // 提取博客文章项
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

  return useQuery({
    queryKey: ['blogData'],
    queryFn: fetchBlogData,
    staleTime: 300000, // 5分钟
  });
};

// 获取所有数据的hook（用于预加载）
export const usePreloadAllData = () => {
  const { refetch: refetchBilibili } = useBilibiliData();
  const { refetch: refetchBlog } = useBlogData();

  const preloadAll = async () => {
    await Promise.all([
      refetchBilibili(),
      refetchBlog()
    ]);
  };

  return { preloadAll };
};