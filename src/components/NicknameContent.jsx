import { motion } from 'framer-motion';
import './CommonContent.css';

const NicknameContent = () => {
  return (
    <motion.div 
      className="content-block"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="content-block-title">昵称的由来</h2>
      <div className="content-block-body">
        <p>Jerry这个名字来源于动画《猫和老鼠》。<img src="/images/OIP.webp" alt="猫和老鼠" className="content-block-inline-image" /></p>
        <p>Z则是我姓名中某个字的首字母。</p>
      </div>
    </motion.div>
  );
};

export default NicknameContent;