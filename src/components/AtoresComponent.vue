<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const atores = ref([])
const carrossel = ref(null)
const router = useRouter()

const abrirAtor = (id) => {
  router.push({ name: 'AtorView', params: { id } })
}

const carregarAtores = async () => {
  try {
    const { data } = await api.get('/person/popular', {
      params: {
        language: 'pt-BR',
        page: 1
      }
    })

    atores.value = data.results.slice(0, 20).map((ator) => {
      const filmePrincipal = ator.known_for?.[0]
      return {
        id: ator.id,
        name: ator.name,
        image: ator.profile_path
          ? `https://image.tmdb.org/t/p/w500${ator.profile_path}`
          : 'https://via.placeholder.com/500x750?text=Sem+Imagem',
        filme: filmePrincipal
          ? filmePrincipal.title || filmePrincipal.name
          : '—'
      }
    })
  } catch (error) {
    console.error('Erro ao carregar atores:', error)
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
  carregarAtores()
})
</script>

<template>
  <div class="AtoresPopulares">
    <h1>Most Popular Actors</h1>

    <div class="carrossel-container">
      <button class="seta esquerda" @click="rolar('esquerda')"><</button>

      <div class="carrossel" ref="carrossel">
        <div
          v-for="ator in atores"
          :key="ator.id"
          class="ator"
          @click="abrirAtor(ator.id)"
        >
          <img :src="ator.image" :alt="ator.name" />
          <h2>{{ ator.name }}</h2>
          <p>{{ ator.filme }}</p>
        </div>
      </div>

      <button class="seta direita" @click="rolar('direita')">></button>
    </div>
  </div>
</template>

<style scoped>
.AtoresPopulares {
  margin: 20px 50px 0 50px;
  font-family: 'Inter', sans-serif;
  color: white;
  border-bottom: 1px solid #444;
}

img{
    max-width: 250px;
    max-height: 375px;
}

.AtoresPopulares h1 {
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

.ator img:hover {
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

