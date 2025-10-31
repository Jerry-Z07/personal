import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '../api.js';
import { cacheManager, CACHE_KEYS } from '../cacheManager.js';
import './BilibiliContent.css';

const BilibiliContent = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取Bilibili用户信息和视频列表（使用缓存）
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 从缓存获取或请求用户信息
        const userData = await cacheManager.getOrFetch(
          CACHE_KEYS.BILIBILI_USER,
          async () => {
            const response = await fetch(`${API_BASE_URL}/v1/social/bilibili/userinfo?uid=401175768`);
            if (!response.ok) {
              throw new Error('获取用户信息失败');
            }
            return response.json();
          }
        );
        
        // 从缓存获取或请求视频列表
        const videosData = await cacheManager.getOrFetch(
          CACHE_KEYS.BILIBILI_VIDEOS,
          async () => {
            const response = await fetch(`${API_BASE_URL}/v1/social/bilibili/archives?mid=401175768`);
            if (!response.ok) {
              throw new Error('获取视频列表失败');
            }
            const data = await response.json();
            return data.videos.slice(0, 8);
          }
        );
        
        // 设置用户信息和视频列表
        setUserInfo(userData);
        setVideos(videosData);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('获取Bilibili数据失败:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 格式化粉丝数
  const formatFollowerCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  // 格式化播放量
  const formatPlayCount = (count) => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  // 格式化视频时长
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



  return (
    <motion.div 
      className="bilibili-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="bilibili-container">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>正在加载用户信息...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>加载失败: {error}</p>
          </div>
        ) : (
          <div className="bilibili-profile">
            <div className="profile-header">
              <div className="user-info">
                <h2 className="username">{userInfo.name}</h2>
                <div className="user-signature">{userInfo.sign}</div>
                <div className="user-stats">
                  <span className="followers-count">粉丝: {formatFollowerCount(userInfo.follower)}</span>
                  <span className="divider">|</span>
                  <span className="following-count">关注: {userInfo.following}</span>
                  <span className="divider">|</span>
                  <span className="likes-count">视频: {userInfo.archive_count}</span>
                </div>
              </div>
            </div>
            
            <div className="video-section">
              <h3 className="video-section-title">最新视频</h3>
              <div className="video-grid">
                {videos.map((video) => (
                  <motion.div 
                    key={video.aid}
                    className="video-card"
                    whileHover={{ 
                      scale: 1.03,
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)"
                    }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    onClick={() => window.open(`https://www.bilibili.com/video/${video.bvid}`, '_blank')}
                  >
                    <div className="video-thumbnail">
                      <img src={video.cover} alt={video.title} />
                      <div className="video-duration">{formatDuration(video.duration)}</div>
                    </div>
                    <div className="video-info">
                      <h4 className="video-title">{video.title}</h4>
                      <div className="video-stats">
                        <span className="video-views">▶ {formatPlayCount(video.play_count)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BilibiliContent;