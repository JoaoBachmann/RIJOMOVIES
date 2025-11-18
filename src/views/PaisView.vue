<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const paisCode = ref(route.params.id)
const paisNome = route.query.name

const filmes = ref([])
const carregando = ref(true)

const getFilmesPorPais = async () => {
  try {
    const { data } = await api.get('/discover/movie', {
      params: {
        with_origin_country: paisCode.value,
        sort_by: 'popularity.desc',
        page: 1,
      },
    })
    filmes.value = data.results
  } catch (err) {
    console.error('Erro ao buscar filmes do país:', err)
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  getFilmesPorPais()
})

watch(
  () => route.fullPath,
  () => {
    paisCode.value = route.params.id
    getFilmesPorPais()
  },
)
</script>

<template>
  <h1>Filmes do país: '{{ paisNome }} - {{ paisCode }}</h1>

  <p v-if="carregando">Carregando...</p>

  <div v-else class="filmePais">
    <div class="carrossel-container">
      <button class="seta esquerda" @click="rolar('esquerda')"><</button>

      <div class="carrossel" ref="carrossel">
        <div v-for="filme in filmes" :key="filme.id" class="filme" @click="abrirFilme(filme.id)">
          <img :src="'https://image.tmdb.org/t/p/w500' + filme.poster_path" :alt="filme.title" />

          <h2>{{ filme.title }}</h2>
          <p>{{ filme.duration }}</p>
        </div>
      </div>

      <button class="seta direita" @click="rolar('direita')">></button>
    </div>
  </div>
</template>

<style scoped>
h3 {
  color: white;
}
p {
  color: rgb(200, 200, 200);
}

.filmePais {
  margin: 20px 50px;
  font-family: 'Inter', sans-serif;
  color: white;
  border-bottom: 1px solid #444;
}

.filmePais h1 {
  font-size: 1.8vw;
  margin-bottom: 10px;
}

.carrossel-container {
  position: relative;
  display: flex;
  align-items: center;
}

.carrossel {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
  scrollbar-width: none;
}

.carrossel::-webkit-scrollbar {
  display: none;
}

.filme img:hover {
  transform: scale(1.05);
}

.seta {
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 10px 15px;
  border-radius: 50%;
  cursor: pointer;
  transition: 0.3s;
  position: absolute;
  z-index: 5;
}

.seta:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.seta.esquerda {
  left: -25px;
}

.seta.direita {
  right: -25px;
}
</style>
