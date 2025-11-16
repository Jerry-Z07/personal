import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import './SidebarNav.css';

const SidebarNav = ({ subTab, onSubTabChange }) => {
  const { t } = useTranslation();
  
  // 使用全局状态管理
  const { handleSubTabChange } = useAppStore();

  // 定义菜单项，使用 Remix Icon
  const menuItems = [
    {
      name: t('sidebar.menu.intro'),
      key: 'intro',
      icon: 'ri-user-line',
      onClick: () => handleSubTabChange('intro'),
      isSelected: subTab === 'intro'
    },
    {
      name: t('sidebar.menu.nickname'),
      key: 'nickname',
      icon: 'ri-information-line',
      onClick: () => handleSubTabChange('nickname'),
      isSelected: subTab === 'nickname'
    },
    {
      name: t('sidebar.menu.projects'),
      key: 'projects',
      icon: 'ri-folder-open-line',
      onClick: () => handleSubTabChange('projects'),
      isSelected: subTab === 'projects'
    }
  ];

  return (
    <motion.div 
      className="sidebar-nav"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="sidebar-nav-content" aria-label="侧边栏导航">
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <motion.button
              key={item.key}
              className={`sidebar-menu-item ${item.isSelected ? 'selected' : ''}`}
              onClick={item.onClick}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              aria-label={item.name}
              title={item.name}
            >
              <i className={item.icon}></i>
              <span className="menu-text">{item.name}</span>
            </motion.button>
          ))}
        </div>
      </nav>
    </motion.div>
  );
};

export default SidebarNav;