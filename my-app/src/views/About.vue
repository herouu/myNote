<template>
  <div class="about">
    <h2>About This App</h2>
    
    <section class="app-info">
      <h3>Technology Stack</h3>
      <ul>
        <li><strong>Vue 3</strong> - Progressive JavaScript Framework</li>
        <li><strong>Vite</strong> - Next Generation Frontend Tooling</li>
        <li><strong>Capacitor</strong> - Cross-platform Native Runtime</li>
        <li><strong>Vue Router</strong> - Official Router for Vue.js</li>
        <li><strong>Pinia</strong> - Intuitive Store for Vue</li>
      </ul>
    </section>

    <section class="features">
      <h3>Features</h3>
      <ul>
        <li>📱 Cross-platform mobile app (iOS & Android)</li>
        <li>🌐 Progressive Web App (PWA) support</li>
        <li>📷 Camera plugin integration</li>
        <li>🧩 Component-based architecture</li>
        <li>⚡ Fast development with Vite HMR</li>
      </ul>
    </section>

    <section class="links">
      <h3>Learn More</h3>
      <ul>
        <li><a href="https://vuejs.org" target="_blank">Vue.js Documentation</a></li>
        <li><a href="https://capacitorjs.com" target="_blank">Capacitor Documentation</a></li>
        <li><a href="https://vitejs.dev" target="_blank">Vite Documentation</a></li>
      </ul>
    </section>

    <nav class="navigation">
      <router-link to="/" class="button">Back to Home</router-link>
    </nav>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.4em;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  color: #333;
}

h3 {
  font-size: 1em;
  text-transform: uppercase;
  margin: 20px 0 10px;
  color: #555;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  padding: 8px 0;
  color: #333;
  line-height: 1.6;
}

li::before {
  content: '•';
  color: #73b5f6;
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}

a {
  color: #73b5f6;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
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
  text-decoration: none;
  color: #fff;
}

.navigation {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
