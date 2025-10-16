import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedText } from './components/AnimatedText.jsx';
import { AnimatedButton } from './components/AnimatedButton.jsx';
import { EntranceAnimation } from './components/PageTransition.jsx';

/**
 * 主页React组件 - 集成Framer Motion动画
 * 替代原有的纯JavaScript实现
 */
export const HomePage = () => {
  const [typingComplete, setTypingComplete] = useState(false);
  const [userLang, setUserLang] = useState('zh-CN');
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    // 获取用户语言设置
    const lang = navigator.language || 'zh-CN';
    setUserLang(lang);
    
    // 加载翻译数据
    loadTranslations(lang);
    
    // 输出欢迎消息
    setTimeout(() => {
      console.log(getWelcomeMessage(lang));
    }, 2000);
  }, []);

  const loadTranslations = async (lang) => {
    try {
      // 使用相对路径导入翻译文件
      const module = await import('../js/translations.js');
      const trans = module.translations || {};
      setTranslations(trans[lang] || trans['zh'] || {});
    } catch (error) {
      console.log('加载翻译失败，使用默认中文');
      setTranslations({
        title: '你好，我是JlyVC',
        buttons: {
          github: 'GitHub',
          blog: '博客',
          bilibili: 'Bilibili'
        }
      });
    }
  };

  const getWelcomeMessage = (lang) => {
    const messages = {
      'zh-CN': '欢迎来到我的个人主页！',
      'en-US': 'Welcome to my personal homepage!',
      'ja': '私の個人ホームページへようこそ！'
    };
    return messages[lang] || messages['zh-CN'];
  };

  const handleTypingComplete = () => {
    setTypingComplete(true);
  };

  const handleClockButtonClick = () => {
    window.location.href = 'clock.html';
  };

  const buttons = [
    {
      variant: 'github',
      href: 'https://github.com/enKl03B',
      target: '_blank',
      icon: <i className="fab fa-github"></i>,
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
      icon: <img src="img/bilibili.svg" alt="Bilibili" style={{width: '20px', height: '20px'}} />,
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{ marginTop: '2rem' }}
          >
              <motion.div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'row', 
                  gap: '1rem',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {buttons.map((button, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: 0.5 + (index * 0.1),
                      duration: 0.5,
                      ease: 'easeOut'
                    }}
                  >
                    <AnimatedButton
                      variant={button.variant}
                      size="medium"
                      href={button.href}
                      target={button.target}
                      icon={button.icon}
                    >
                      {button.text}
                    </AnimatedButton>
                  </motion.div>
                ))}
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 时钟按钮 */}
      <motion.button
        className="clock-toggle-react"
        onClick={handleClockButtonClick}
        whileHover={{ 
          scale: 1.1,
          backgroundColor: 'rgba(255, 255, 255, 0.2)'
        }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          rotate: [0, 360]
        }}
        transition={{ 
          delay: 2,
          duration: 0.8,
          rotate: {
            duration: 2,
            ease: "easeInOut"
          }
        }}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: 'white',
          fontSize: '1.2rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)'
        }}
        title="全屏时钟"
      >
        <i className="fas fa-clock"></i>
      </motion.button>
    </div>
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
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2 }}
          >
            Coding with Trae & Kimi-K2
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
  useEffect(() => {
    // 加载背景图片（复用原有的背景加载逻辑）
    const loadBackground = async () => {
      try {
        // 动态导入背景加载模块
        const { loadBackgroundImage } = await import('../js/background.js');
        loadBackgroundImage();
      } catch (error) {
        console.warn('背景图片加载失败，使用CSS渐变背景');
        const bgContainer = document.querySelector('.background-container');
        if (bgContainer) {
          bgContainer.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
          bgContainer.style.backgroundSize = 'cover';
          bgContainer.style.backgroundPosition = 'center';
          bgContainer.style.backgroundAttachment = 'fixed';
        }
      }
    };
    
    loadBackground();
  }, []);

  return (
    <div className="app-container">
      {/* 背景图片 */}
      <motion.div 
        className="background-container"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <img 
          id="background-image" 
          alt="背景图片"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
      </motion.div>

      {/* 主要内容 */}
      <HomePage />
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
};

export default App;