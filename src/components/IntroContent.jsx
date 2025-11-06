import { motion } from 'framer-motion';
import { useTranslation, Trans } from 'react-i18next';
import './CommonContent.css';

const IntroContent = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <motion.div 
      className="content-block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="content-block-title">{t('intro.title')}</h2>
      <div className="content-block-body">
        <p>{t('intro.content.p1')}</p>
        <p>
          <Trans i18nKey="intro.content.p2_with_strikethrough">
            技术力约等于零<span className="content-block-strikethrough">（所以AI真的太好用了你知道吗）</span>
          </Trans>。
        </p>
      </div>
    </motion.div>
  );
};

export default IntroContent;