<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
</script>

<template>
  <header>
    <HeaderComponent />
  </header>
  <main>
    <router-view />
  </main>
  <footer></footer>


</template>

<style scoped></style>