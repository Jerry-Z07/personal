import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroContent from './IntroContent';
import NicknameContent from './NicknameContent';
import './ContentArea.css';

const ContentArea = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'intro':
        return <IntroContent />;
      case 'nickname':
        return <NicknameContent />;
      default:
        return <IntroContent />;
    }
  };

  return (
    <div className="content-area">
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>
    </div>
  );
};

export default ContentArea;