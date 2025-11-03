import { motion, AnimatePresence } from 'framer-motion';
import IntroContent from './IntroContent';
import NicknameContent from './NicknameContent';
import BilibiliContent from './BilibiliContent';
import BlogContent from './BlogContent';
import './ContentArea.css';

const ContentArea = ({ mainTab, subTab, showSidebar }) => {
  const renderContent = () => {
    // 如果是 intro 主标签，根据 subTab 来显示内容
    if (mainTab === 'intro') {
      switch (subTab) {
        case 'intro':
          return <IntroContent />;
        case 'nickname':
          return <NicknameContent />;
        default:
          return <IntroContent />;
      }
    }
    
    // 其他主标签直接根据 mainTab 显示
    switch (mainTab) {
      case 'bilibili':
        return <BilibiliContent />;
      case 'blog':
        return <BlogContent />;
      default:
        return <IntroContent />;
    }
  };

  return (
    <div className={`content-area ${showSidebar ? 'with-sidebar' : 'full-width'}`}>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

export default ContentArea;