<script setup>
import HeaderComponent from './components/HeaderComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import { computed, ref} from 'vue';

const paisSelecionado = ref(null)

const recebePais = (pais) => {
  paisSelecionado.value = pais 
}

const filmes = ref([]) 

const filmesFiltrados = computed(() => {
  if (!paisSelecionado.value) return filmes.value
  
  return filmes.value.filter(filme => {
    return filme.origin_country?.includes(paisSelecionado.value.iso_3166_1)
  })
})





</script>

<template>
  <header>
    <HeaderComponent @paisSelecionado="recebePais"/>
  </header>
  <main>
    <router-view />
  </main>
  <FooterComponent />


</template>

<style scoped></style>