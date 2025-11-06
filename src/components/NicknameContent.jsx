import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import './CommonContent.css';

const NicknameContent = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <motion.div 
      className="content-block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="content-block-title">{t('nickname.title')}</h2>
      <div className="content-block-body">
        <p>{t('nickname.content.p1')}<img src="/images/OIP.webp" alt={t('nickname.content.p1_alt')} className="content-block-inline-image" /></p>
        <p>{t('nickname.content.p2')}</p>
      </div>
    </motion.div>
  );
};

export default NicknameContent;