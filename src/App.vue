<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <header>
    <HeaderComponent />
  </header>
  <main>
    <router-view />
  </main>

  <footer>
    <FooterComponent />
  </footer>

</template>

<style scoped></style>