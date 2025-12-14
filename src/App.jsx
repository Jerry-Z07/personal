import React, { useEffect, useRef, useState } from "react";
import BentoCard from "./components/BentoCard";
import Modal from "./components/Modal";
import { fetchDailyPoemText } from "./utils/api";
import { Link } from "react-router";

// 链接数据
const SOCIAL_LINKS = [
  { name: "GitHub", icon: "ri-github-fill", url: "https://github.com/Jerry-Z07", color: "bg-gray-800 text-white" },
];

function App() {
  // 状态：记录当前哪个卡片被选中了 (null | 'bilibili' | 'blog')
  const [selectedId, setSelectedId] = useState(null);
  // 打字机相关状态
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);
  const deletingTimerRef = useRef(null);
  const refreshTimerRef = useRef(null);

  // 打字动画：逐字符追加显示
  const typeText = (text) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    if (refreshTimerRef.current) { clearTimeout(refreshTimerRef.current); refreshTimerRef.current = null; }
    const normalized = typeof text === "string" ? text.trim() : String(text ?? "").trim();
    setTypedText("");
    if (normalized.length === 0) {
      setIsTyping(false);
      setTypedText("热衷于创造简洁、优雅的代码艺术。");
      refreshTimerRef.current = setTimeout(() => { startDeletionThenRefresh(); }, 15000);
      return;
    }
    setIsTyping(true);
    let i = 0;
    typingTimerRef.current = setInterval(() => {
      if (i < normalized.length) {
        const ch = normalized.charAt(i);
        setTypedText((prev) => prev + ch);
        i += 1;
      } else {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        setIsTyping(false);
        refreshTimerRef.current = setTimeout(() => { startDeletionThenRefresh(); }, 15000);
      }
    }, 60);
  };

  // 删除动画：逐字符从末尾删除
  const deleteText = () => {
    return new Promise((resolve) => {
      if (deletingTimerRef.current) clearInterval(deletingTimerRef.current);
      let current = "";
      setTypedText((prev) => {
        current = prev;
        return prev;
      });
      if (!current || current.length === 0) {
        resolve();
        return;
      }
      deletingTimerRef.current = setInterval(() => {
        current = current.slice(0, -1);
        setTypedText(current);
        if (current.length === 0) {
          clearInterval(deletingTimerRef.current);
          deletingTimerRef.current = null;
          resolve();
        }
      }, 40);
    });
  };

  // 删除后请求新文本并执行打字动画
  const startDeletionThenRefresh = async () => {
    // 清理可能遗留的刷新定时器
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    await deleteText();
    try {
      const text = await fetchDailyPoemText();
      const normalized = typeof text === "string" ? text.trim() : String(text ?? "").trim();
      typeText(normalized || "热衷于创造简洁、优雅的代码艺术。");
    } catch (err) {
      // 失败回退为默认文案
      typeText("热衷于创造简洁、优雅的代码艺术。");
    }
  };

  // 初始加载：立即请求一次并执行打字动画
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const text = await fetchDailyPoemText();
        if (!mounted) return;
        const normalized = typeof text === "string" ? text.trim() : String(text ?? "").trim();
        typeText(normalized || "热衷于创造简洁、优雅的代码艺术。");
      } catch {
        if (!mounted) return;
        typeText("热衷于创造简洁、优雅的代码艺术。");
      }
    })();

    return () => {
      mounted = false;
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      if (deletingTimerRef.current) clearInterval(deletingTimerRef.current);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 text-zinc-800 dark:bg-[#0a0a0a] dark:text-gray-100">
      
      {/* 布局容器：自适应屏幕宽度的大布局 */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:max-w-5xl md:max-w-6xl lg:max-w-7xl md:grid-cols-3 md:auto-rows-[220px] lg:auto-rows-[240px]">
        
        {/* 1. 主卡片：个人信息 (占 2x2) */}
        {/* 延迟 0.1s 入场 */}
        <BentoCard 
          className="md:col-span-2 md:row-span-2"
          delay={0.1}
        >
          <div className="h-full flex flex-col">
            {/* 上半部分：头像和个人信息 */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                  {/* 替换为你的头像 */}
                  <img src="/psg.jpg" alt="Avatar" className="h-full w-full object-cover" />
                </div>
              </div>
              
              <h1 className="mt-6 text-3xl font-bold tracking-tight">Jerry.Z</h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <span>{typedText}</span>
                {isTyping && <span className="typing-cursor ml-1" />}
              </p>
            </div>
            
            {/* 下半部分：相关链接 */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Links / 相关链接</h3>
              <div className={`grid gap-3 ${
                SOCIAL_LINKS.length === 1 
                  ? 'grid-cols-1' 
                  : 'grid-cols-2 sm:grid-cols-3'
              }`}>
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-xl bg-white/50 p-3 transition-all hover:bg-white hover:scale-105 hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
                  >
                    {/* 图标容器 */}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${link.color}`}>
                      <i className={`${link.icon} text-lg`}></i>
                    </div>
                    <span className="font-medium text-sm">{link.name}</span>
                    {/* 箭头图标 */}
                    <i className="ri-arrow-right-up-line ml-auto text-gray-400 opacity-0 transition-opacity group-hover:opacity-100"></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </BentoCard>

        {/* 2. PROJECT卡片：个人项目 (占 1x2) */}
        {/* 延迟 0.2s 入场 */}
        <BentoCard 
          className="md:col-span-1 md:row-span-2 flex flex-col"
          delay={0.2}
        >
          <div className="mb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="ri-rocket-line text-3xl text-purple-500"></i>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2 text-center">PROJECT / 个人项目</h3>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
            {/* 个人项目列表 */}
            <div className="flex flex-col gap-3">
              {/* 项目数据 */}
              {[
                {
                  name: "Mixi",
                  description: "Mix Inteligence.一个多功能的QQ机器人",
                  icon: "https://q.qlogo.cn/headimg_dl?dst_uin=3834216037&spec=640",
                  color: "bg-blue-500/20 text-blue-500",
                  url: "https://mh.078465.xyz"
                },
              ].map((project, index) => (
                <a
                  key={index}
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  {/* 左侧：项目图标 - 支持图标名称和图片链接 */}
                  <div className={`w-10 h-10 rounded-full ${project.color} flex items-center justify-center overflow-hidden`}>
                    {project.icon && (project.icon.startsWith('http://') || project.icon.startsWith('https://')) ? (
                      <img 
                        src={project.icon} 
                        alt={`${project.name} icon`} 
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <i className={`${project.icon} text-xl`}></i>
                    )}
                  </div>
                  
                  {/* 中间：项目名称和描述 */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white dark:text-gray-100 truncate">{project.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{project.description}</p>
                  </div>
                  
                  {/* 右侧：链接跳转Icon */}
                  <i className="ri-arrow-right-up-line text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" style={{ width: '16px' }}></i>
                </a>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 3. 工具集卡片 (占 3x1, 长条形) */}
        {/* 延迟 0.3s 入场 */}
        <BentoCard 
          className="md:col-span-3 md:row-span-1"
          delay={0.3}
        >
          <div className="h-full flex flex-col">
            {/* 工具集标题 */}
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Tools / 工具集</h3>
            
            {/* 工具列表：网格布局，自动适应内容 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {/* 工具数据 */}
              {[
                { name: "Live / 直播", icon: "ri-broadcast-line", color: "bg-pink-500/20 text-pink-500", url: "/live" },
              ].map((tool, index) => (
                <Link
                  key={index}
                  to={tool.url}
                  className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5"
                >
                  {/* 工具图标 */}
                  <div className={`w-10 h-10 rounded-full ${tool.color} flex items-center justify-center`}>
                    <i className={`${tool.icon} text-xl`}></i>
                  </div>
                  
                  {/* 工具名称 */}
                  <span className="text-xs font-medium text-center truncate max-w-full">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </BentoCard>

        {/* 4. Bilibili 卡片 (占 2x1, 可点击) */}
        {/* 延迟 0.4s 入场 */}
        <BentoCard 
          className="md:col-span-2 md:row-span-1 group justify-between bg-[#00aeec]/10 dark:bg-[#00aeec]/20 border-[#00aeec]/20"
          onClick={() => setSelectedId('bilibili')}
          layoutId="card-bilibili" 
          spotlightColor="0, 174, 236" 
          delay={0.4} 
        >
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2 text-[#00aeec]">
                <i className="ri-bilibili-fill text-3xl"></i>
                <span className="font-bold text-xl">Bilibili / 哔哩哔哩</span>
             </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto">
            我的B站账号
          </p>
        </BentoCard>

        {/* 5. Blog 卡片 (占 1x1, 可点击) */}
        {/* 延迟 0.5s 入场 */}
        <BentoCard 
          className="md:col-span-1 md:row-span-1 group justify-between bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20"
          onClick={() => setSelectedId('blog')}
          layoutId="card-blog"
          spotlightColor="255, 115, 0" 
          delay={0.5}
        >
           <div className="flex items-center gap-2 text-orange-500">
              <i className="ri-article-fill text-2xl"></i>
              <span className="font-bold text-lg">Blog / 博客</span>
           </div>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
             随心随记
           </p>
        </BentoCard>

      </div>

      {/* 使用独立的弹窗组件 */}
      <Modal selectedId={selectedId} setSelectedId={setSelectedId} />

{/* 页脚：左文右按钮 */}
<footer className="mt-10 pt-6 border-t border-gray-200/50 dark:border-white/10">
  <div className="mx-auto w-full max-w-7xl">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        By <span className="font-semibold">JerryZ</span> with <span className="align-middle">❤️</span>
      </p>
      <a
        href="https://uptime.078465.xyz/status/default"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-white/50 px-3 py-1.5 text-sm font-medium transition-all hover:bg-white hover:shadow-md dark:bg-white/5 dark:hover:bg-white/10"
      >
        <i className="ri-server-line text-gray-500 dark:text-gray-400"></i>
        网站状态
        <i className="ri-arrow-right-up-line text-gray-400"></i>
      </a>
    </div>
  </div>
</footer>
    </div>
  );
}

export default App;
