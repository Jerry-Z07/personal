import { create } from 'zustand';

// 存储键名常量
const STORAGE_KEYS = {
  MAIN_TAB: 'mainTab',
  SUB_TAB: 'subTab'
};

// 创建主状态管理store，采用分组结构
export const useStore = create((set, get) => ({
  // 状态分组
  ui: {
    isLoading: true,
    showSecondaryHeader: false,
    showViewportContent: true
  },
  
  tabs: {
    mainTab: null,
    subTab: 'intro',
    lastMainTab: 'intro',
    lastSubTab: 'intro'
  },
  
  callbacks: {
    refreshBilibiliRef: null,
    refreshBlogRef: null
  },
  
  // 统一的sessionStorage更新函数
  updateStorage: (key, value) => {
    if (value) {
      sessionStorage.setItem(key, value);
    } else {
      sessionStorage.removeItem(key);
    }
  },
  
  // UI状态更新函数
  setUIState: (updates) => set((state) => ({
    ui: { ...state.ui, ...updates }
  })),
  
  // 标签状态更新函数
  setTabState: (updates) => set((state) => ({
    tabs: { ...state.tabs, ...updates }
  })),
  
  // 回调引用更新函数
  setCallbackRef: (callbackType, callback) => set((state) => ({
    callbacks: { ...state.callbacks, [callbackType]: callback }
  })),
  
  // 处理返回主页
  handleBackToHome: () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 统一处理：返回主页时显示PersonalTitle页面
    const { updateStorage } = get();
    updateStorage(STORAGE_KEYS.MAIN_TAB, null); // 清除标签存储
    updateStorage(STORAGE_KEYS.SUB_TAB, null);
    
    set((state) => ({
      ui: {
        ...state.ui,
        showViewportContent: false,
        showSecondaryHeader: false // 不显示二级页眉，显示PersonalTitle
      },
      tabs: {
        ...state.tabs,
        mainTab: null, // 清除当前标签
        subTab: null
      }
    }));
  },
  
  // 处理主标签切换
  handleMainTabChange: (tabName) => {
    const { updateStorage } = get();
    // 切换主标签时，重置子标签为各主标签的默认子标签
    const newSubTab = tabName === 'intro' ? 'intro' : null;
    
    // 使用统一的存储更新函数
    updateStorage(STORAGE_KEYS.MAIN_TAB, tabName);
    updateStorage(STORAGE_KEYS.SUB_TAB, newSubTab);
    
    set((state) => ({
      ui: {
        ...state.ui,
        showViewportContent: false,
        showSecondaryHeader: true
      },
      tabs: {
        ...state.tabs,
        mainTab: tabName,
        subTab: newSubTab,
        lastMainTab: tabName,
        lastSubTab: newSubTab
      }
    }));
  },
  
  // 处理子标签切换
  handleSubTabChange: (subTabName) => {
    const { updateStorage } = get();
    updateStorage(STORAGE_KEYS.SUB_TAB, subTabName);
    
    set((state) => ({
      tabs: {
        ...state.tabs,
        subTab: subTabName,
        lastSubTab: subTabName
      }
    }));
  },
  
  // 处理刷新
  handleRefresh: () => {
    const { tabs, callbacks } = get();
    if (tabs.mainTab === 'bilibili' && callbacks.refreshBilibiliRef) {
      callbacks.refreshBilibiliRef();
    } else if (tabs.mainTab === 'blog' && callbacks.refreshBlogRef) {
      callbacks.refreshBlogRef();
    }
  },
  
  // 从sessionStorage初始化状态
  initializeFromStorage: () => {
    const savedMainTab = sessionStorage.getItem(STORAGE_KEYS.MAIN_TAB);
    const savedSubTab = sessionStorage.getItem(STORAGE_KEYS.SUB_TAB);
    
    // 统一处理：默认显示PersonalTitle页面
    const defaultMainTab = null;
    const defaultSubTab = null;
    
    set(() => ({
      tabs: {
        mainTab: defaultMainTab, // 默认不设置标签
        subTab: defaultSubTab, // 默认不设置子标签
        lastMainTab: savedMainTab || 'intro', // 保留上次访问的标签用于记录
        lastSubTab: savedSubTab || 'intro' // 保留上次访问的子标签用于记录
      },
      ui: {
        isLoading: true,
        showSecondaryHeader: false, // 默认不显示二级页眉，显示PersonalTitle
        showViewportContent: false // 默认不显示主视图内容
      }
    }));
  }
}));