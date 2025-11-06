import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './Footer.css';

const Footer = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="footer-container">
        <div className="footer-left">
          <span>{t('footer.signature')}</span>
        </div>
        <div className="footer-right">
          <motion.a
            href="https://stats.uptimerobot.com/bYVW2cRJ5T"
            target="_blank"
            rel="noopener noreferrer"
            className="status-button"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
          >
            <i className="ri-pulse-line"></i>
            <span>{t('footer.status.button')}</span>
            <i className="ri-external-link-line external-icon"></i>
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
