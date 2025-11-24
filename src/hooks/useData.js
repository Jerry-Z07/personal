import { useState, useEffect } from 'react';
import { fetchBilibiliUserInfo, fetchBilibiliArchives, fetchBlogFeed } from '../utils/api';

/**
 * 标准化B站用户信息数据格式
 * @param {Object} data 原始用户数据
 * @returns {Object} 标准化后的用户数据
 */
const normalizeUserInfo = (data) => {
  if (!data) return null;
  
  return {
    ...data,
    followers: data.followers || data.follower || 0,
    archive_count: data.archive_count || data.videos || 0
  };
};

/**
 * 获取B站用户信息的Hook
 * @returns {Object} 用户信息状态和操作函数
 */
export const useBilibiliUserInfo = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchBilibiliUserInfo();
        // 优化数据格式验证，更加健壮地处理API返回
        if (data && (data.data || (data.code === 0 && data.data))) {
          // 优先使用data.data，如果没有则使用整个响应
          const userData = data.data || data;
          setUserInfo(normalizeUserInfo(userData));
        } else if (data) {
          // 如果不是期望格式但有数据，尝试使用并标准化字段
          setUserInfo(normalizeUserInfo(data));
        }
      } catch (err) {
        setError(err.message);
        console.error('加载用户信息失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserInfo();
  }, []);

  // 刷新用户信息的函数
  const refreshUserInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
        const data = await fetchBilibiliUserInfo();
        // 优化数据格式验证，更加健壮地处理API返回
        if (data && (data.data || (data.code === 0 && data.data))) {
          // 优先使用data.data，如果没有则使用整个响应
          const userData = data.data || data;
          setUserInfo(normalizeUserInfo(userData));
        } else if (data) {
          // 如果不是期望格式但有数据，尝试使用并标准化字段
          setUserInfo(normalizeUserInfo(data));
        }
      } catch (err) {
      setError(err.message);
      console.error('刷新用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    userInfo,
    loading,
    error,
    refreshUserInfo
  };
};

/**
 * 获取B站视频列表的Hook
 * @param {Object} options 配置选项
 * @param {number} options.ps 每页数量
 * @param {string} options.orderby 排序方式
 * @returns {Object} 视频列表状态和操作函数
 */
export const useBilibiliArchives = ({ ps = 8, orderby = 'pubdate' } = {}) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchBilibiliArchives(ps, orderby);
        // 优化数据格式验证，更加健壮地处理API返回
        if (data && Array.isArray(data.videos)) {
          setVideos(data.videos);
          setTotal(data.total || data.size || 0);
          setPage(data.page || 1);
        } else if (data && Array.isArray(data)) {
          // 如果直接返回视频数组
          setVideos(data);
          setTotal(data.length);
          setPage(1);
        } else {
          // 设置空数组而不是抛出错误
          setVideos([]);
          setTotal(0);
          setPage(1);
        }
      } catch (err) {
        setError(err.message);
        console.error('加载视频列表失败:', err);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, [ps, orderby]);

  // 刷新视频列表的函数
  const refreshVideos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchBilibiliArchives(ps, orderby);
      // 优化数据格式验证，更加健壮地处理API返回
      if (data && Array.isArray(data.videos)) {
        setVideos(data.videos);
        setTotal(data.total || data.size || 0);
        setPage(data.page || 1);
      } else if (data && Array.isArray(data)) {
        // 如果直接返回视频数组
        setVideos(data);
        setTotal(data.length);
        setPage(1);
      } else {
        // 设置空数组而不是抛出错误
        setVideos([]);
        setTotal(0);
        setPage(1);
      }
    } catch (err) {
      setError(err.message);
      console.error('刷新视频列表失败:', err);
    } finally {
      setLoading(false);
    }
  };

  // 切换排序方式的函数
  const changeOrderBy = (newOrderBy) => {
    if (newOrderBy !== orderby) {
      // 这里通过更新state触发useEffect重新加载数据
      // 实际实现中应该通过props或context来管理orderby状态
    }
  };

  return {
    videos,
    loading,
    error,
    total,
    page,
    refreshVideos,
    changeOrderBy
  };
};

/**
 * 组合获取B站用户信息和视频列表的Hook
 * 适用于需要同时展示用户信息和视频列表的场景
 * @returns {Object} 组合的数据状态和操作函数
 */
export const useBilibiliData = () => {
  const userInfoHook = useBilibiliUserInfo();
  const videosHook = useBilibiliArchives();

  // 组合刷新函数
  const refreshAll = async () => {
    await Promise.all([
      userInfoHook.refreshUserInfo(),
      videosHook.refreshVideos()
    ]);
  };

  // 检查是否所有数据都加载完成
  const allLoading = userInfoHook.loading || videosHook.loading;
  const allError = userInfoHook.error || videosHook.error;

  return {
    userInfo: userInfoHook.userInfo,
    videos: videosHook.videos,
    total: videosHook.total,
    loading: allLoading,
    error: allError,
    refresh: refreshAll,
    refreshUserInfo: userInfoHook.refreshUserInfo,
    refreshVideos: videosHook.refreshVideos,
    changeOrderBy: videosHook.changeOrderBy
  };
};

/**
 * 获取博客 RSS 列表的Hook
 * 默认只返回前 limit 条
 * @param {number} limit 最大返回条数
 */
export const useBlogFeed = (limit = 5) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await fetchBlogFeed();
      setPosts(Array.isArray(items) ? items.slice(0, limit) : []);
    } catch (err) {
      setError(err.message);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  const refresh = async () => {
    await load();
  };

  return {
    posts,
    loading,
    error,
    refresh,
  };
};
