<template>
  <div id="app">
    <header class="app-header">
      <h1>{{ title }}</h1>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Capacitor + Vue 3');
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #73b5f6;
  color: white;
  padding: 15px;
  text-align: center;
}

.app-header h1 {
  font-size: 1.2em;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.app-main {
  flex: 1;
  padding: 15px;
}
</style>
