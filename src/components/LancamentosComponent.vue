<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const filmes = ref([])
const carrossel = ref(null) 
const router = useRouter()

const abrirFilme = (id) => {
  router.push({ name: 'MovieView', params: { id } })
}

const carregarFilmes = async () => {
  try {
    const { data } = await api.get('/movie/popular')

    filmes.value = await Promise.all(
      data.results.slice(0, 20).map(async (filme) => {
        const detalhes = await api.get(`/movie/${filme.id}`)

        return {
          id: filme.id,
          title: filme.title,
          image: `https://image.tmdb.org/t/p/w500${filme.backdrop_path || filme.poster_path}`,
          duration: detalhes.data.runtime ? `${detalhes.data.runtime}m` : '—'
        }
      })
    )
  } catch (error) {
    console.error('Erro ao carregar filmes:', error)
  }
}

const rolar = (direcao) => {
  const container = carrossel.value
  const largura = container.clientWidth
  container.scrollBy({
    left: direcao === 'direita' ? largura : -largura,
    behavior: 'smooth'
  })
}

onMounted(() => {
  carregarFilmes()
})
</script>

<template>
  <main>
  <div class="NovosLancamentos">
    <h1>New Releases</h1>

    <div class="carrossel-container">
      <button class="seta esquerda" @click="rolar('esquerda')"><</button>

      <div class="carrossel" ref="carrossel">
        <div
          v-for="filme in filmes"
          :key="filme.id"
          class="filme"
          @click="abrirFilme(filme.id)"
        >
          <img :src="filme.image" :alt="filme.title" />
          <h2>{{ filme.title }}</h2>
          <p>{{ filme.duration }}</p>
        </div>
      </div>

      <button class="seta direita" @click="rolar('direita')">></button>
    </div>
  </div>
  </main>
</template>

<style scoped>
.NovosLancamentos {
  margin: 20px 50px;
  font-family: 'Inter', sans-serif;
  color: white;
  border-bottom: 1px solid #444;

}

.NovosLancamentos h1 {
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
.filme img {
  width: 500px;
  max-height: 281px;
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
