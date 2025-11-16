import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 全局应用状态管理
 * 使用 Zustand 进行状态管理，支持持久化存储到 sessionStorage
 */
const useAppStore = create(
  persist(
    (set, get) => ({
      // 加载状态
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // UI状态管理
      showSecondaryHeader: false,
      setShowSecondaryHeader: (show) => set({ showSecondaryHeader: show }),
      
      showViewportContent: true,
      setShowViewportContent: (show) => set({ showViewportContent: show }),
      
      // 标签状态管理
      mainTab: null,
      setMainTab: (tab) => {
        set({ mainTab: tab });
        // 切换主标签时，重置子标签为各主标签的默认子标签
        // 简介标签的默认子标签为 intro
        if (tab === 'intro') {
          set({ subTab: 'intro' });
        } else {
          set({ subTab: null });
        }
        // 点击标签时隐去主页内容
        set({ showViewportContent: false });
      },
      
      subTab: 'intro', // 默认子标签
      setSubTab: (tab) => set({ subTab: tab }),
      
      // 存储上次访问的标签，用于从主页返回时恢复
      lastMainTab: 'intro',
      setLastMainTab: (tab) => set({ lastMainTab: tab }),
      
      lastSubTab: 'intro',
      setLastSubTab: (tab) => set({ lastSubTab: tab }),
      
      // 刷新回调函数引用 (不持久化)
      refreshBilibiliRef: { current: null },
      refreshBlogRef: { current: null },
      
      // 设置刷新回调
      setRefreshBilibiliRef: (ref) => {
        // 直接更新引用对象，不触发状态更新
        const state = get();
        state.refreshBilibiliRef.current = ref;
      },
      setRefreshBlogRef: (ref) => {
        // 直接更新引用对象，不触发状态更新
        const state = get();
        state.refreshBlogRef.current = ref;
      },
      
      // 动作方法
      // 处理返回主页
      handleBackToHome: () => {
        set({
          showViewportContent: true,
          showSecondaryHeader: false,
          mainTab: null
        });
        // 滚动回顶部
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      },
      
      // 处理滚动指示器点击
      handleScrollIndicatorClick: () => {
        const { lastMainTab, lastSubTab } = get();
        set({
          showSecondaryHeader: true,
          showViewportContent: false,
          mainTab: lastMainTab,
          subTab: lastSubTab
        });
      },
      
      // 处理主标签切换
      handleMainTabChange: (tabName) => {
        const { setMainTab } = get();
        setMainTab(tabName);
      },
      
      // 处理子标签切换（侧边栏）
      handleSubTabChange: (subTabName) => {
        set({ subTab: subTabName });
      },
      
      // 处理刷新
      handleRefresh: () => {
        const { mainTab, refreshBilibiliRef, refreshBlogRef } = get();
        if (mainTab === 'bilibili' && refreshBilibiliRef.current) {
          refreshBilibiliRef.current();
        } else if (mainTab === 'blog' && refreshBlogRef.current) {
          refreshBlogRef.current();
        }
      },
      
      // 检测是否为移动端
      isMobile: () => {
        return window.innerWidth <= 768;
      }
    }),
    {
      name: 'app-storage', // 存储键名
      storage: {
        getItem: (name) => {
          const item = sessionStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        }
      },
      // 只持久化这些字段
      partialize: (state) => ({
        mainTab: state.mainTab,
        subTab: state.subTab,
        lastMainTab: state.lastMainTab,
        lastSubTab: state.lastSubTab
      })
    }
  )
);

export default useAppStore;