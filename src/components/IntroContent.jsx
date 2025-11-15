import { useTranslation, Trans } from 'react-i18next';
import AnimatedContent from './AnimatedContent';

const IntroContent = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <AnimatedContent titleKey="intro.title">
      <p>{t('intro.content.p1')}</p>
      <p>
        <Trans i18nKey="intro.content.p2_with_strikethrough">
          技术力约等于零<span className="animated-content-strikethrough">（所以AI真的太好用了你知道吗）</span>
        </Trans>。
      </p>
    </AnimatedContent>
  );
};

export default IntroContent;