import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './ProjectsContent.css';

const ProjectsContent = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  // 项目数据
  const projects = [
    {
      id: 1,
      titleKey: 'mixi',  // 使用key而不是硬编码文本
      descriptionKey: 'mixi',
      tags: [],
      status: 'running',
      image: 'https://q.qlogo.cn/headimg_dl?dst_uin=3834216037&spec=640',
      link: 'https://mh.078465.xyz/'
    }
  ];

  // 状态映射 - 仅保留颜色，标签文本使用i18n
  const statusMap = {
    active: { color: '#29764C' },
    completed: { color: '#2196F3' },
    planning: { color: '#FF9800' },
    running: { color: '#4CAF50' },
  };

  // 卡片动画变体
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <motion.div 
      className="content-block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="content-block-title">{t('projects.title')}</h2>
      
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="project-card"
            custom={index}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ 
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
          >
            {/* 项目图标 */}
            <div className="project-icon">
              <img src={project.image} alt={t(`projects.card.title.${project.titleKey}`)} />
            </div>

            {/* 项目头部：标题和状态横向布局 */}
            <div className="project-header">
              <h3 className="project-title">{t(`projects.card.title.${project.titleKey}`)}</h3>
              <div className="project-status-badge" style={{ backgroundColor: statusMap[project.status].color }}>
                {t(`projects.status.${project.status}`)}
              </div>
            </div>

            {/* 项目描述 */}
            <p className="project-description">{t(`projects.card.description.${project.descriptionKey}`)}</p>

            {/* 技术标签 */}
            {project.tags.length > 0 && (
              <div className="project-tags">
                {project.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="project-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="project-actions">
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-eye-line"></i>
                <span>{t('projects.action.view')}</span>
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsContent;
