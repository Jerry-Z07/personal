import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './BlogContent.css';

const BlogContent = () => {
  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        // 开发环境使用代理，生产环境直接访问
        const feedUrl = import.meta.env.MODE === 'development' 
          ? '/blog-feed/' 
          : 'https://blog.078465.xyz/feed/';
        
        const response = await fetch(feedUrl);
        const text = await response.text();
        
        // 解析 XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        // 提取 image 信息
        const imageNode = xmlDoc.querySelector('image');
        const blogTitle = imageNode?.querySelector('title')?.textContent || '博客';
        const blogLink = imageNode?.querySelector('link')?.textContent || '';
        
        // 提取前 5 个 item
        const items = Array.from(xmlDoc.querySelectorAll('item')).slice(0, 5).map(item => {
          const title = item.querySelector('title')?.textContent || '';
          const link = item.querySelector('link')?.textContent || '';
          const description = item.querySelector('description')?.textContent || '';
          
          // 提取描述的前 100 个字符
          const shortDescription = description.length > 100 
            ? description.substring(0, 100) + '...' 
            : description;
          
          return { title, link, description: shortDescription };
        });
        
        setBlogData({ blogTitle, blogLink, items });
        setError(null);
      } catch (err) {
        console.error('获取博客数据失败:', err);
        setError('无法加载博客数据');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

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
