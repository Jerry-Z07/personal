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
    // 判断是否在生产环境，使用CORS代理
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = `${BILIBILI_USERINFO_API}?uid=${USER_UID}`;
    
    let response;
    if (isProduction) {
      // 生产环境使用CORS代理
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/json, */*'
        }
      });
    } else {
      // 开发环境直接请求
      response = await fetch(apiUrl);
    }
    
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
    // 判断是否在生产环境，使用CORS代理
    const isProduction = process.env.NODE_ENV === 'production';
    const apiUrl = `${BILIBILI_ARCHIVES_API}?ps=${ps}&mid=${USER_UID}&orderby=${orderby}`;
    
    let response;
    if (isProduction) {
      // 生产环境使用CORS代理
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(apiUrl)}`;
      response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/json, */*'
        }
      });
    } else {
      // 开发环境直接请求
      response = await fetch(apiUrl);
    }
    
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

// 博客 RSS 地址
const BLOG_RSS_URL = 'https://blog.078465.xyz/feed/';

// CORS 代理地址
const CORS_PROXY = 'https://cors1.078465.xyz/v1/proxy/?quest=';

/**
 * 获取今日诗词纯文本（通过CORS代理）
 * @returns {Promise<string>} 诗词纯文本
 */
export const fetchDailyPoemText = async () => {
  try {
    const targetUrl = 'https://v1.jinrishici.com/all.txt';
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(targetUrl)}`;
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/plain, */*'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error('获取今日诗词失败:', error);
    throw error;
  }
};

/**
 * 获取博客 RSS 并解析为文章列表
 * 返回字段：title、link、description
 * @returns {Promise<Array<{title:string,link:string,description:string}>>}
 */
export const fetchBlogFeed = async () => {
  try {
    // 通过CORS代理请求博客RSS
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(BLOG_RSS_URL)}`;
    const response = await fetch(proxyUrl, {
      headers: {
        // 尽量声明接受 XML/RSS，提升兼容性
        'Accept': 'application/rss+xml, application/xml, text/xml, */*'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'application/xml');

    // 优先解析 RSS 的 <item>
    const itemNodes = Array.from(doc.getElementsByTagName('item'));
    let items = itemNodes.map((node) => {
      const title = node.getElementsByTagName('title')[0]?.textContent?.trim() || '';
      const link = node.getElementsByTagName('link')[0]?.textContent?.trim() || '';
      const description = node.getElementsByTagName('description')[0]?.textContent?.trim() || '';
      return { title, link, description };
    });

    // 兼容 Atom 格式 (<entry>)
    if (!items.length) {
      const entryNodes = Array.from(doc.getElementsByTagName('entry'));
      items = entryNodes.map((node) => {
        const title = node.getElementsByTagName('title')[0]?.textContent?.trim() || '';
        const linkEl = node.getElementsByTagName('link')[0];
        const link = linkEl?.getAttribute('href')?.trim() || '';
        const description = node.getElementsByTagName('summary')[0]?.textContent?.trim()
          || node.getElementsByTagName('content')[0]?.textContent?.trim()
          || '';
        return { title, link, description };
      });
    }

    return items;
  } catch (error) {
    console.error('获取博客RSS失败:', error);
    throw error;
  }
};
