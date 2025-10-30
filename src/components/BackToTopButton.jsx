import { motion } from 'framer-motion';
import './BackToTopButton.css';

const BackToTopButton = ({ onClick }) => {
  return (
    <motion.button
      className="back-to-top-button"
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="回到主页"
    >
      <i className="ri-arrow-up-line"></i>
    </motion.button>
  );
};

export default BackToTopButton;
