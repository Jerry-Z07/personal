import { QueryClient } from '@tanstack/react-query';

// 创建QueryClient实例
// 设置默认缓存时间为5分钟（300000ms），与原cacheManager保持一致
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000, // 5分钟
      gcTime: 300000, // 5分钟
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
    },
  },
});

export default queryClient;