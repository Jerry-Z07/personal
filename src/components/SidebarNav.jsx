import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Nav } from '@fluentui/react';
import './SidebarNav.css';

const SidebarNav = ({ subTab, onSubTabChange }) => {
  const { t } = useTranslation();

  // 定义菜单项，映射到 Fluent UI 8 Nav 组件格式
  const menuItems = [
    {
      name: t('sidebar.menu.intro'),
      key: 'intro',
      icon: "useroptional",
      onClick: () => onSubTabChange('intro'),
      isSelected: subTab === 'intro'
    },
    {
      name: t('sidebar.menu.nickname'),
      key: 'nickname',
      icon: "info2",
      onClick: () => onSubTabChange('nickname'),
      isSelected: subTab === 'nickname'
    },
    {
      name: t('sidebar.menu.projects'),
      key: 'projects',
      icon: "fabricfolder",
      onClick: () => onSubTabChange('projects'),
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
      <Nav
        groups={[
          {
            links: menuItems
          }
        ]}
        selectedKey={subTab}
        onLinkClick={(ev, element) => {
          ev?.preventDefault();
          const linkKey = element?.key;
          if (linkKey) {
            onSubTabChange(linkKey);
          }
        }}
        aria-label="侧边栏导航"
        className="fluent-ui-nav"
      />
    </motion.div>
  );
};

export default SidebarNav;