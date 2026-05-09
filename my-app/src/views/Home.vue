<template>
  <div class="home">
    <section class="intro">
      <p>
        Capacitor makes it easy to build powerful apps for the app stores, mobile web (Progressive Web Apps), and desktop, all
        with a single code base.
      </p>
    </section>

    <section class="getting-started">
      <h2>Getting Started</h2>
      <p>
        This app is now powered by <strong>Vue 3</strong>!
      </p>
      <p>
        Visit <a href="https://capacitorjs.com">capacitorjs.com</a> for information
        on using native features, building plugins, and more.
      </p>
      <a href="https://capacitorjs.com" target="_blank" class="button">Read more</a>
    </section>

    <section class="demo">
      <h2>Tiny Demo</h2>
      <p>
        This demo shows how to call Capacitor plugins. Say cheese!
      </p>
      <p>
        <button class="button" @click="takePhoto">Take Photo</button>
      </p>
      <p v-if="imageSrc">
        <img :src="imageSrc" alt="Captured photo" class="preview-image" />
      </p>
    </section>

    <nav class="navigation">
      <router-link to="/about" class="button">Go to About</router-link>
      <router-link to="/roughness" class="button" style="margin-left: 10px;">Roughness UI Demo</router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Camera } from '@capacitor/camera';

const imageSrc = ref('');

const takePhoto = async () => {
  try {
    const photo = await Camera.getPhoto({
      resultType: 'uri',
    });
    imageSrc.value = photo.webPath;
  } catch (e) {
    console.warn('User cancelled', e);
  }
};
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  font-size: 1.1em;
  text-transform: uppercase;
  margin: 20px 0 10px;
  color: #333;
}

h3 {
  font-size: 0.9em;
  text-transform: uppercase;
  margin: 15px 0 8px;
  color: #555;
}

p {
  color: #333;
  line-height: 1.6;
  margin: 10px 0;
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

.preview-image {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

hr {
  height: 1px;
  background-color: #eee;
  border: 0;
  margin: 20px 0;
}

.navigation {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}
</style>
