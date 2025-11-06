import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './BilibiliContent.css';
import cacheManager from '../cacheManager';
import { fetchBilibiliData } from '../dataPreloader';

// 缓存有效期：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

const BilibiliContent = ({ onRefresh }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  const [userInfo, setUserInfo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 获取Bilibili用户信息和视频列表
  useEffect(() => {
    const loadData = async () => {
      // 如果有缓存，直接使用缓存
      if (cacheManager.has('bilibili')) {
        const cachedData = cacheManager.get('bilibili');
        setUserInfo(cachedData.userInfo);
        setVideos(cachedData.videos);
        setLoading(false);
        return;
      }

      // 没有缓存则获取数据
      try {
        setLoading(true);
        const data = await fetchBilibiliData();
        setUserInfo(data.userInfo);
        setVideos(data.videos);
        cacheManager.set('bilibili', data, CACHE_DURATION);
        setError(null);
        console.log(t('app.bilibili.success'));
      } catch (err) {
        setError(err.message);
        console.error(t('app.bilibili.error'), err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);
  
  // 设置刷新回调
  useEffect(() => {
    if (onRefresh) {
      onRefresh(async () => {
        try {
          setLoading(true);
          cacheManager.clear('bilibili');
          
          const data = await fetchBilibiliData();
          setUserInfo(data.userInfo);
          setVideos(data.videos);
          cacheManager.set('bilibili', data, CACHE_DURATION);
          setError(null);
        } catch (err) {
          setError(err.message);
          console.error(t('app.bilibili.refreshError'), err);
        } finally {
          setLoading(false);
        }
      });
    }
  }, [onRefresh]);

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
      {loading ? (
        <div className="bilibili-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>{t('bilibili.loading')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="bilibili-container">
          <div className="error-container">
            <p>{t('bilibili.error.prefix')}{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* 个人信息容器 */}
          <div className="bilibili-container">
            <div className="bilibili-profile">
              <div className="profile-header">
                <div className="user-info">
                  <h2 className="username">{userInfo.name}</h2>
                  <div className="user-signature">{userInfo.sign}</div>
                  <div className="user-stats">
                    <span className="followers-count">{t('bilibili.stats.follower')}{formatFollowerCount(userInfo.follower)}</span>
                    <span className="divider">|</span>
                    <span className="following-count">{t('bilibili.stats.following')}{userInfo.following}</span>
                    <span className="divider">|</span>
                    <span className="likes-count">{t('bilibili.stats.video')}{userInfo.archive_count}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 视频列表区域 */}
          <div className="video-section">
            <h3 className="video-section-title">{t('bilibili.videoSection.title')}</h3>
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
        </>
      )}
    </motion.div>
  );
};

export default BilibiliContent;