import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import DataContent from './DataContent';
import { fetchBlogData } from '../dataPreloader';
import './BlogContent.css';

const BlogContent = ({ onRefresh }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  // 自定义渲染函数
  const renderBlogData = (data) => {
    return (
      <>
        <a 
          href={data?.blogLink} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="blog-title-link"
        >
          <h2 className="blog-title">{data?.blogTitle}</h2>
        </a>
        
        <div className="blog-posts">
          {data?.items.map((item, index) => (
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
                  <span>{t('blog.post.readMore')}</span>
                  <i className="ri-arrow-right-line"></i>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </>
    );
  };

  // 自定义加载组件
  const loadingComponent = (
    <div className="blog-loading">{t('blog.loading')}</div>
  );

  // 自定义错误组件
  const errorComponent = (
    <div className="blog-error">{t('blog.error')}</div>
  );

  return (
    <DataContent
      cacheKey="blog"
      fetchData={fetchBlogData}
      renderData={renderBlogData}
      loadingComponent={loadingComponent}
      errorComponent={errorComponent}
      className="blog-content"
      onRefresh={onRefresh}
    />
  );
};

export default BlogContent;
