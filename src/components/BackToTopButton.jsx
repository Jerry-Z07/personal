import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './BackToTopButton.css';

const BackToTopButton = ({ onClick }) => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <motion.button
      className="back-to-top-button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={t('backToTop.ariaLabel')}
    >
      <i className="ri-arrow-up-line"></i>
    </motion.button>
  );
};

export default BackToTopButton;
