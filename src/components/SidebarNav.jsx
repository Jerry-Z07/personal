import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './SidebarNav.css';

const SidebarNav = ({ subTab, onSubTabChange }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  const menuItems = [
    { id: 'intro', icon: 'ri-user-3-line' },
    { id: 'nickname', icon: 'ri-question-line' },
    { id: 'projects', icon: 'ri-folder-3-line' }
  ];

  return (
    <motion.div 
      className="sidebar-nav"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <motion.button
            key={item.id}
            className={`nav-item ${subTab === item.id ? 'active' : ''}`}
            onClick={() => onSubTabChange(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className={`${item.icon} nav-icon`}></i>
            <span className="nav-label">{t(`sidebar.menu.${item.id}`)}</span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default SidebarNav;