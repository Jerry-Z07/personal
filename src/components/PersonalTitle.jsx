import { useTranslation } from 'react-i18next';
import './PersonalTitle.css';

const PersonalTitle = () => {
  // 使用i18n翻译函数
  const { t } = useTranslation();

  return (
    <div className="personal-title-container">
      <h1 className="personal-title">
        {t('personalTitle.main')}
      </h1>
    </div>
  );
};

export default PersonalTitle;