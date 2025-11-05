import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BlogContent.css';
import cacheManager from '../cacheManager';
import { fetchBlogData } from '../dataPreloader';

// 缓存有效期：5分钟
const CACHE_DURATION = 5 * 60 * 1000;

const BlogContent = ({ onRefresh }) => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      // 如果有缓存，直接使用缓存
      if (cacheManager.has('blog')) {
        const cachedData = cacheManager.get('blog');
        setBlogData(cachedData);
        setLoading(false);
        return;
      }

      // 没有缓存则获取数据
      try {
        setLoading(true);
        const data = await fetchBlogData();
        setBlogData(data);
        cacheManager.set('blog', data, CACHE_DURATION);
        setError(null);
      } catch (err) {
        console.error('获取博客数据失败:', err);
        setError('无法加载博客数据');
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
          cacheManager.clear('blog');
          
          const data = await fetchBlogData();
          setBlogData(data);
          cacheManager.set('blog', data, CACHE_DURATION);
          setError(null);
        } catch (err) {
          console.error('刷新博客数据失败:', err);
          setError('无法加载博客数据');
        } finally {
          setLoading(false);
        }
      });
    }
  }, [onRefresh]);

  if (loading) {
    return (
      <motion.div 
        className="blog-content"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="blog-loading">加载中...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="blog-content"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="blog-error">{error}</div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="blog-content"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <a 
        href={blogData?.blogLink} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="blog-title-link"
      >
        <h2 className="blog-title">{blogData?.blogTitle}</h2>
      </a>
      
      <div className="blog-posts">
        {blogData?.items.map((item, index) => (
          <motion.div 
            key={index}
            className="blog-post-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="blog-post-link">
              <h3 className="blog-post-title">{item.title}</h3>
              <p className="blog-post-description">{item.description}</p>
              <div className="blog-post-read-more">
                <span>阅读更多</span>
                <i className="ri-arrow-right-line"></i>
              </div>
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BlogContent;
