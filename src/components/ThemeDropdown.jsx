import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx"; // 确保你安装了 clsx
import { useTheme } from "../hooks/useTheme"; // 引入刚才写的 hook

const ThemeDropdown = () => {
  const { themeMode, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 定义选项数据
  const options = [
    { value: "light", label: "浅色模式", icon: "ri-sun-line" },
    { value: "dark", label: "深色模式", icon: "ri-moon-line" },
    { value: "system", label: "跟随系统", icon: "ri-computer-line" },
  ];

  // 获取当前显示的图标（用于触发按钮）
  const getCurrentIcon = () => {
    if (themeMode === "light") return "ri-sun-line";
    if (themeMode === "dark") return "ri-moon-line";
    return "ri-computer-line";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. 触发按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300",
          "bg-white/50 backdrop-blur-md hover:bg-white/80 hover:scale-105 active:scale-95 shadow-sm",
          "dark:bg-white/10 dark:hover:bg-white/20 dark:text-gray-200 text-gray-700",
          "border border-gray-200/50 dark:border-white/10"
        )}
        aria-label="Theme Settings"
      >
        <i className={`${getCurrentIcon()} text-lg`}></i>
      </button>

      {/* 2. 下拉菜单 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
            className={clsx(
              "absolute right-0 top-12 z-50 min-w-[160px] overflow-hidden rounded-xl",
              "bg-white/80 backdrop-blur-xl dark:bg-[#1a1a1a]/90", // 强玻璃质感背景
              "border border-gray-200/50 dark:border-white/10 shadow-xl",
              "p-1.5 flex flex-col gap-0.5"
            )}
          >
            {options.map((option) => {
              const isActive = themeMode === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    setTheme(option.value);
                    setIsOpen(false);
                  }}
                  className={clsx(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" // 选中状态
                      : "text-gray-600 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-white/10" // 默认状态
                  )}
                >
                  <i className={`${option.icon} text-base`}></i>
                  <span>{option.label}</span>
                  
                  {/* 选中时的对勾图标 */}
                  {isActive && (
                    <motion.i 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="ri-check-line ml-auto text-blue-600 dark:text-blue-400" 
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeDropdown;