import { motion } from 'framer-motion';
import './CommonContent.css';

const IntroContent = () => {
  return (
    <motion.div 
      className="content-block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="content-block-title">个人简介</h2>
      <div className="content-block-body">
        <p>我叫Jerry.Z，来自中国🇨🇳，目前是一名高中生。</p>
        <p>技术力大概约等于零<span className="content-block-strikethrough">（所以AI真的太好用了你知道吗）</span>。</p>
      </div>
    </motion.div>
  );
};

export default IntroContent;