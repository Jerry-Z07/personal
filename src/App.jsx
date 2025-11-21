import React, { useState } from "react";
import BentoCard from "./components/BentoCard";
import Modal from "./components/Modal";

// 模拟链接数据
const SOCIAL_LINKS = [
  { name: "GitHub", icon: "ri-github-fill", url: "#", color: "bg-gray-800 text-white" },
  { name: "Email", icon: "ri-mail-send-fill", url: "#", color: "bg-blue-600 text-white" },
];

function App() {
  // 状态：记录当前哪个卡片被选中了 (null | 'bilibili' | 'blog')
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-12 text-zinc-800 dark:bg-[#0a0a0a] dark:text-gray-100">
      
      {/* 布局容器：自适应屏幕宽度的大布局 */}
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 sm:max-w-5xl md:max-w-6xl lg:max-w-7xl md:grid-cols-3 md:auto-rows-[220px] lg:auto-rows-[240px]">
        
        {/* 1. 主卡片：个人信息 (占 2x2) */}
        <BentoCard className="md:col-span-2 md:row-span-2">
          <div className="h-full flex flex-col">
            {/* 上半部分：头像和个人信息 */}
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 shadow-2xl">
                  {/* 替换为你的头像 */}
                  <img src="https://blog.078465.xyz/wp-content/uploads/2025/11/163709829.jpg" alt="Avatar" className="h-full w-full object-cover" />
                </div>
              </div>
              
              <h1 className="mt-6 text-3xl font-bold tracking-tight">Jerry.Z</h1>
              <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
                热衷于创造简洁、优雅的代码艺术。
              </p>
            </div>
            
            {/* 下半部分：相关链接 */}
            <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-white/10">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Links / 相关链接</h3>
              <div className="grid grid-cols-2 gap-3">
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
        <BentoCard className="md:col-span-1 md:row-span-2 flex flex-col justify-center items-center text-center">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <i className="ri-rocket-line text-3xl text-purple-500"></i>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">PROJECT / 个人项目</h3>
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/10">
              <p className="text-xs text-gray-400">
                即将上线 🚀
              </p>
            </div>
          </div>
        </BentoCard>

        {/* 3. Bilibili 卡片 (占 2x1, 可点击) */}
        <BentoCard 
          className="md:col-span-2 md:row-span-1 group justify-between bg-[#00aeec]/10 dark:bg-[#00aeec]/20 border-[#00aeec]/20"
          onClick={() => setSelectedId('bilibili')}
          layoutId="card-bilibili" // 动画ID
        >
          <div className="flex justify-between items-start">
             <div className="flex items-center gap-2 text-[#00aeec]">
                <i className="ri-bilibili-fill text-3xl"></i>
                <span className="font-bold text-xl">Bilibili</span>
             </div>
             <div className="rounded-full bg-white/30 p-2 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <i className="ri-fullscreen-line"></i>
             </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-auto">
            点击查看我的最新视频 →
          </p>
        </BentoCard>

        {/* 4. Blog 卡片 (占 1x1, 可点击) */}
        <BentoCard 
          className="md:col-span-1 md:row-span-1 group justify-between bg-orange-500/10 dark:bg-orange-500/20 border-orange-500/20"
          onClick={() => setSelectedId('blog')}
          layoutId="card-blog" // 动画ID
        >
           <div className="flex items-center gap-2 text-orange-500">
              <i className="ri-article-fill text-2xl"></i>
              <span className="font-bold text-lg">Blog</span>
           </div>
           <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
             随心随记
           </p>
        </BentoCard>

      </div>

      {/* 使用独立的弹窗组件 */}
      <Modal selectedId={selectedId} setSelectedId={setSelectedId} />

    </div>
  );
}

export default App;