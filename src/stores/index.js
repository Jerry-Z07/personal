import { create } from 'zustand';

// 创建主状态管理store
export const useStore = create((set, get) => ({
  // UI状态
  isLoading: true,
  showSecondaryHeader: false,
  showViewportContent: true,
  
  // 标签状态
  mainTab: null,
  subTab: 'intro', // 默认子标签
  lastMainTab: 'intro',
  lastSubTab: 'intro',
  
  // 刷新回调引用
  refreshBilibiliRef: null,
  refreshBlogRef: null,
  
  // 设置加载状态
  setIsLoading: (loading) => set({ isLoading: loading }),
  
  // 设置二级页眉显示
  setShowSecondaryHeader: (show) => set({ showSecondaryHeader: show }),
  
  // 设置视口内容显示
  setShowViewportContent: (show) => set({ showViewportContent: show }),
  
  // 设置主标签并保存到sessionStorage
  setMainTab: (tabName) => set((state) => {
    if (tabName) {
      sessionStorage.setItem('mainTab', tabName);
      return { 
        mainTab: tabName,
        lastMainTab: tabName 
      };
    } else {
      sessionStorage.removeItem('mainTab');
      return { mainTab: null };
    }
  }),
  
  // 设置子标签并保存到sessionStorage
  setSubTab: (tabName) => set((state) => {
    if (tabName) {
      sessionStorage.setItem('subTab', tabName);
      return { 
        subTab: tabName,
        lastSubTab: tabName 
      };
    } else {
      sessionStorage.removeItem('subTab');
      return { subTab: null };
    }
  }),
  
  // 设置刷新回调
  setRefreshBilibiliRef: (callback) => set({ refreshBilibiliRef: callback }),
  setRefreshBlogRef: (callback) => set({ refreshBlogRef: callback }),
  
  // 处理返回主页
  handleBackToHome: () => set(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return {
      showViewportContent: true,
      showSecondaryHeader: false,
      mainTab: null
    };
  }),
  
  // 处理主标签切换
  handleMainTabChange: (tabName) => set((state) => {
    // 切换主标签时，重置子标签为各主标签的默认子标签
    const newSubTab = tabName === 'intro' ? 'intro' : null;
    if (newSubTab) {
      sessionStorage.setItem('subTab', newSubTab);
    } else {
      sessionStorage.removeItem('subTab');
    }
    sessionStorage.setItem('mainTab', tabName);
    return {
      mainTab: tabName,
      subTab: newSubTab,
      showViewportContent: false,
      showSecondaryHeader: true,
      lastMainTab: tabName,
      lastSubTab: newSubTab
    };
  }),
  
  // 处理子标签切换
  handleSubTabChange: (subTabName) => set((state) => {
    sessionStorage.setItem('subTab', subTabName);
    return {
      subTab: subTabName,
      lastSubTab: subTabName
    };
  }),
  
  // 处理刷新
  handleRefresh: () => {
    const { mainTab, refreshBilibiliRef, refreshBlogRef } = get();
    if (mainTab === 'bilibili' && refreshBilibiliRef) {
      refreshBilibiliRef();
    } else if (mainTab === 'blog' && refreshBlogRef) {
      refreshBlogRef();
    }
  },
  
  // 处理滚动指示器点击
  handleScrollIndicatorClick: () => set((state) => ({
    showSecondaryHeader: true,
    showViewportContent: false,
    mainTab: state.lastMainTab,
    subTab: state.lastSubTab
  })),
  
  // 从sessionStorage初始化状态
  initializeFromStorage: () => set(() => {
    const savedMainTab = sessionStorage.getItem('mainTab');
    const savedSubTab = sessionStorage.getItem('subTab');
    
    // 只有当确实保存了标签状态时才恢复，否则保持在首页
    return {
      mainTab: null, // 首页刷新时始终设置为null，保持在首页
      subTab: null, // 首页刷新时始终设置为null
      lastMainTab: savedMainTab || null, // 保留上次访问的标签用于记录
      lastSubTab: savedSubTab || null, // 保留上次访问的子标签用于记录
      showSecondaryHeader: false, // 首页刷新时始终显示首页
      showViewportContent: true // 首页刷新时始终显示主视图内容
    };
  })
}));