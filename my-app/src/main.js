import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 导入 roughness 组件库及样式
import Roughness from 'roughness';
import 'roughness/dist/style.css';

// 导入 Capacitor 插件
import { SplashScreen } from '@capacitor/splash-screen';

// 引入 vConsole（仅在开发模式启用）
if (import.meta.env.DEV) {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole();
  });
}

// 创建 Vue 应用
const app = createApp(App);

// 使用 roughness 组件库
app.use(Roughness);

// 使用 Pinia 状态管理
app.use(createPinia());

// 使用 Vue Router
app.use(router);

// 挂载应用
app.mount('#app');

// 隐藏启动屏
SplashScreen.hide();
