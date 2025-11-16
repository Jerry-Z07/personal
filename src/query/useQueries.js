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
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Blog data');
    }
    
    // 由于Blog返回的是RSS格式，需要特殊处理
    const text = await response.text();
    // 这里假设前端有解析RSS的逻辑，暂时返回原始文本
    return text;
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