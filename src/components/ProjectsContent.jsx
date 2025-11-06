import { motion } from 'framer-motion';
import './ProjectsContent.css';

const ProjectsContent = () => {
  // 项目数据
  const projects = [
    {
      id: 1,
      title: 'Mixi',
      description: 'Mix Intelligence. 一个多功能的QQ机器人，自2024.7.12运营至今',
      tags: [],
      status: 'running',
      image: 'https://q.qlogo.cn/headimg_dl?dst_uin=3834216037&spec=640',
      link: 'https://mh.078465.xyz/'
    }
  ];

  // 状态映射
  const statusMap = {
    active: { label: '进行中', color: '#29764C' },
    completed: { label: '已完成', color: '#2196F3' },
    planning: { label: '规划中', color: '#FF9800' },
    running: { label: '运行中', color: '#4CAF50' },
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
      <h2 className="content-block-title">个人项目</h2>
      
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
              <img src={project.image} alt={project.title} />
            </div>

            {/* 项目头部：标题和状态横向布局 */}
            <div className="project-header">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-status-badge" style={{ backgroundColor: statusMap[project.status].color }}>
                {statusMap[project.status].label}
              </div>
            </div>

            {/* 项目描述 */}
            <p className="project-description">{project.description}</p>

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
                <span>查看详情</span>
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsContent;
