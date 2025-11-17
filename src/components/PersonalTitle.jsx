import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './PersonalTitle.css';

const PersonalTitle = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <motion.div 
      className="personal-title-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut"
      }}
    >
      <motion.h1 
        className="personal-title"

        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 10 
        }}
      >
        {t('personalTitle.main')}
      </motion.h1>
    </motion.div>
  );
};

export default PersonalTitle;