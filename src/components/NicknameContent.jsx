import { useTranslation } from 'react-i18next';
import AnimatedContent from './AnimatedContent';

const NicknameContent = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <AnimatedContent titleKey="nickname.title">
      <p>
        {t('nickname.content.p1')}
        <img src="/images/OIP.webp" alt={t('nickname.content.p1_alt')} className="content-block-inline-image" />
      </p>
      <p>{t('nickname.content.p2')}</p>
    </AnimatedContent>
  );
};

export default NicknameContent;