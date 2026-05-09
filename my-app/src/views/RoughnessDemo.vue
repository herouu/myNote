<template>
  <div class="roughness-demo">
    <h2>Roughness UI 演示</h2>
    <p class="description">
      Roughness 是一个具有手绘风格的 Vue 组件库，基于 Rough.js 构建。
    </p>

    <section class="demo-section">
      <h3>按钮示例</h3>
      <div class="button-group">
        <button class="rough-button primary">主要按钮</button>
        <button class="rough-button secondary">次要按钮</button>
        <button class="rough-button outline">轮廓按钮</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>卡片示例</h3>
      <div class="card">
        <h4>手绘风格卡片</h4>
        <p>这是一个使用 Roughness 风格设计的卡片组件。</p>
        <button class="rough-button small">查看详情</button>
      </div>
    </section>

    <section class="demo-section">
      <h3>颜色主题</h3>
      <div class="color-palette">
        <div class="color-item" style="background-color: #73b5f6;">蓝色</div>
        <div class="color-item" style="background-color: #5ad85a;">绿色</div>
        <div class="color-item" style="background-color: #f5a623;">橙色</div>
        <div class="color-item" style="background-color: #ff6b6b;">红色</div>
      </div>
    </section>

    <section class="demo-section">
      <h3>交互示例</h3>
      <div class="interactive-demo">
        <p>点击次数: {{ count }}</p>
        <button class="rough-button primary" @click="count++">点击我</button>
        <button class="rough-button outline" @click="count = 0">重置</button>
      </div>
    </section>

    <nav class="navigation">
      <router-link to="/" class="button">返回首页</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const count = ref(0);
</script>

<style scoped>
.roughness-demo {
  max-width: 800px;
  margin: 0 auto;
}

.description {
  color: #666;
  line-height: 1.6;
  margin: 10px 0 20px;
}

.demo-section {
  margin: 30px 0;
  padding: 20px;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 4px 4px 0px #333;
}

.demo-section h3 {
  font-size: 1em;
  text-transform: uppercase;
  margin-bottom: 15px;
  color: #333;
}

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.rough-button {
  padding: 12px 24px;
  font-size: 1em;
  border: 2px solid #333;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Cabin Sketch', 'Segoe UI', sans-serif;
  transition: all 0.2s;
  box-shadow: 3px 3px 0px #333;
}

.rough-button.primary {
  background-color: #73b5f6;
  color: white;
}

.rough-button.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.rough-button.outline {
  background-color: transparent;
  color: #333;
}

.rough-button.small {
  padding: 8px 16px;
  font-size: 0.9em;
}

.rough-button:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0px #333;
}

.rough-button:active {
  transform: translate(0, 0);
  box-shadow: 2px 2px 0px #333;
}

.card {
  padding: 15px;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.card h4 {
  margin-bottom: 10px;
  color: #333;
}

.card p {
  color: #666;
  margin-bottom: 15px;
}

.color-palette {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.color-item {
  width: 80px;
  height: 80px;
  border: 2px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 3px 3px 0px #333;
}

.interactive-demo {
  text-align: center;
}

.interactive-demo p {
  font-size: 1.2em;
  margin-bottom: 15px;
  color: #333;
}

.navigation {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #73b5f6;
  color: #fff;
  font-size: 0.9em;
  border: 0;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #5a9fd8;
}
</style>
