// B站数据API工具函数

// B站用户信息API基础URL
const BILIBILI_USERINFO_API = 'https://uapis.cn/api/v1/social/bilibili/userinfo';

// B站视频列表API基础URL
const BILIBILI_ARCHIVES_API = 'https://uapis.cn/api/v1/social/bilibili/archives';

// 用户UID
const USER_UID = '401175768';

/**
 * 获取B站用户信息
 * @returns {Promise<Object>} 用户信息数据
 */
export const fetchBilibiliUserInfo = async () => {
  try {
    const response = await fetch(`${BILIBILI_USERINFO_API}?uid=${USER_UID}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取B站用户信息失败:', error);
    throw error;
  }
};

/**
 * 获取B站视频列表
 * @param {number} ps 每页数量，默认8
 * @param {string} orderby 排序方式，默认按发布时间
 * @returns {Promise<Object>} 视频列表数据
 */
export const fetchBilibiliArchives = async (ps = 8, orderby = 'pubdate') => {
  try {
    const response = await fetch(`${BILIBILI_ARCHIVES_API}?ps=${ps}&mid=${USER_UID}&orderby=${orderby}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取B站视频列表失败:', error);
    throw error;
  }
};

/**
 * 格式化播放量数字
 * @param {number} count 播放量
 * @returns {string} 格式化后的播放量
 */
export const formatPlayCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '万';
  }
  return count.toString();
};

/**
 * 格式化时长
 * @param {number} seconds 秒数
 * @returns {string} 格式化后的时长
 */
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * 格式化发布时间
 * @param {number} timestamp 时间戳
 * @returns {string} 格式化后的时间
 */
export const formatPublishTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp * 1000;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  
  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    const date = new Date(timestamp * 1000);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
};