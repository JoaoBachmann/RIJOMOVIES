<script setup>
import Home from './views/HomeView.vue';
</script>

<template>
  <header></header>
  <main>
    <router-view />
  </main>
  <footer></footer>

import HeaderComponent from './components/HeaderComponent.vue';
</script>

<template>
  <HeaderComponent />
</template>

<style scoped></style>