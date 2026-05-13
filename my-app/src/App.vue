<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
import '@chinese-fonts/yozai/dist/Yozai-Regular/result.css'
import '@chinese-fonts/yozai/dist/Yozai-Bold/result.css'
</script>

<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}

html,
body {
  font-family: 'Yozai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  background-color: #f0efe9;
}

#app {
  width: 100%;
  min-height: 100vh;
  background-color: #f0efe9;
}
</style>
