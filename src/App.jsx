import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedText } from './components/AnimatedText.jsx';
import { AnimatedButton } from './components/AnimatedButton.jsx';
import { EntranceAnimation } from './components/PageTransition.jsx';
import { BackgroundContainer } from './components/BackgroundContainer.jsx';
import { ButtonGroup } from './components/ButtonGroup.jsx';
import { TranslationProvider, useTranslation } from './contexts/TranslationContext.jsx';
import { Github, Bilibili } from '@lobehub/icons';

/**
 * 主页内容组件 - 使用翻译上下文
 */
const HomePageContent = () => {
  const [typingComplete, setTypingComplete] = useState(false);
  const { translations } = useTranslation();

  const handleTypingComplete = () => {
    setTypingComplete(true);
  };

  const buttons = [
    {
      variant: 'github',
      href: 'https://github.com/enKl03B',
      target: '_blank',
      icon: <Github size={20} />,
      text: translations.buttons?.github || 'GitHub'
    },
    {
      variant: 'blog',
      href: 'https://blog.078465.xyz',
      target: '_blank',
      icon: <i className="fas fa-blog"></i>,
      text: translations.buttons?.blog || '博客'
    },
    {
      variant: 'bilibili',
      href: 'https://space.bilibili.com/401175768',
      target: '_blank',
      icon: <Bilibili size={20} />,
      text: translations.buttons?.bilibili || 'Bilibili'
    }
  ];

  return (
    <div className="main-content">
      {/* 打字机效果标题 */}
      <EntranceAnimation mode="fadeUp" duration={0.8}>
        <AnimatedText
          text={translations.title || '你好，我是JlyVC'}
          speed={120}
          className="typing-title"
          onComplete={handleTypingComplete}
          cursorChar="▊"
        />
      </EntranceAnimation>

      {/* 副标题 - 在主标题打字动画完成后渐变出现 */}
      <AnimatePresence>
        {typingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            style={{ 
              marginTop: '1rem',
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '350',
              letterSpacing: '2px'
            }}
          >
            也是enKl03B
          </motion.div>
        )}
      </AnimatePresence>

      {/* 按钮组 */}
      <AnimatePresence>
        {typingComplete && (
          <ButtonGroup
            buttons={buttons}
            delay={0.5}
            stagger={0.1}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * 主页React组件 - 集成Framer Motion动画
 * 替代原有的纯JavaScript实现
 */
export const HomePage = () => {
  return (
    <TranslationProvider>
      <HomePageContent />
    </TranslationProvider>
  );
};

/**
 * 页脚组件 - 集成Framer Motion动画
 */
export const Footer = () => {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.5, duration: 0.8, ease: 'easeOut' }}
    >
      <div className="footer-content">
        <motion.div 
          className="footer-info"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            Made by enKl03B with ❤️
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="footer-status"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.4, duration: 0.6 }}
        >
          <AnimatedButton
            variant="primary"
            size="small"
            href="https://stats.uptimerobot.com/bYVW2cRJ5T"
            target="_blank"
            icon={<i className="fas fa-chart-line"></i>}
          >
            网站状态
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.footer>
  );
};

/**
 * 主应用组件 - 包含背景和主要内容
 */
export const App = () => {
  return (
    <div className="app-container">
      {/* 背景容器 */}
      <BackgroundContainer>
        {/* 主要内容 */}
        <HomePage />
        
        {/* 页脚 */}
        <Footer />
      </BackgroundContainer>
    </div>
  );
};

export default App;