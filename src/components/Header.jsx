import React from "react";
import { motion } from "framer-motion";
import { cn } from "./BentoCard"; 

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 18 }}
      className={cn(
        "mx-auto flex w-full max-w-7xl items-center justify-between",
        "rounded-3xl border border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-xl",
        "dark:border-white/10 dark:bg-zinc-900/70",
        "px-4 py-3 sm:px-6 sm:py-4"
      )}
    >
      {/* 左侧：标题 */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold sm:text-lg">关于 Jerry.Z</span>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-emerald-500">
              Student
            </span>
          </div>
        </div>
      </div>

      {/* 右侧： 快捷入口 */}
      <nav className="hidden items-center gap-2 text-xs font-medium text-gray-500 sm:flex dark:text-gray-400">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-full px-3 py-1 hover:bg-gray-100 dark:hover:bg-white/5"
        >
          回到顶部
        </button>
      </nav>
    </motion.header>
  );
};

export default Header;