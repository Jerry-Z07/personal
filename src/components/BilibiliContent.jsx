import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DataContent from './DataContent';
import { fetchBilibiliData } from '../dataPreloader';
import './BilibiliContent.css';

const BilibiliContent = ({ onRefresh }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

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

  // 自定义渲染函数
  const renderBilibiliData = (data) => {
    const { userInfo, videos } = data;

    return (
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
    );
  };

  // 自定义加载组件
  const loadingComponent = (
    <div className="bilibili-container">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('bilibili.loading')}</p>
      </div>
    </div>
  );

  // 自定义错误组件
  const errorComponent = (
    <div className="bilibili-container">
      <div className="error-container">
        <p>{t('bilibili.error.prefix')}</p>
      </div>
    </div>
  );

  return (
    <DataContent
      cacheKey="bilibili"
      fetchData={fetchBilibiliData}
      renderData={renderBilibiliData}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      className="bilibili-content"
      onRefresh={onRefresh}
    />
  );
};

export default BilibiliContent;