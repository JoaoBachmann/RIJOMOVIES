<script setup>
import { ref } from 'vue'

const opcoes = ref(false)
</script>

<template>
  <header>
    <img src="/public/RiJoMovies.png" alt="RijoMovies Logo" />
    <button @click="opcoes = true">Filmes</button>
    <div v-if="opcoes">
      <select name="paises" id="paises">
        <!--Aqui vou ter q pegar da api os países. E provavelmente colocar a api no pai e mandar as infos para os filhos-->
      </select>
    </div>
    <button><span class="mdi mdi-account-circle"></span></button>
    <button>Entrar</button>
  </header>
</template>

<style  scoped>
header {
  background-color: black;

 
}
</style>
