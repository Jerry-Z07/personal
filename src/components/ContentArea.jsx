import { motion, AnimatePresence } from 'framer-motion';
import IntroContent from './IntroContent';
import NicknameContent from './NicknameContent';
import BilibiliContent from './BilibiliContent';
import './ContentArea.css';

const ContentArea = ({ activeTab, showSidebar }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroContent />;
      case 'nickname':
        return <NicknameContent />;
      case 'bilibili':
        return <BilibiliContent />;
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