import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

// 导入 Capacitor 插件
import { SplashScreen } from '@capacitor/splash-screen';

// 创建 Vue 应用
const app = createApp(App);

// 使用 Pinia 状态管理
app.use(createPinia());

// 使用 Vue Router
app.use(router);

// 挂载应用
app.mount('#app');

// 隐藏启动屏
SplashScreen.hide();
