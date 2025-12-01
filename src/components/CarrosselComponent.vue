<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import Loading from 'vue-loading-overlay' 
import 'vue-loading-overlay/dist/css/index.css' 
import '@mdi/font/css/materialdesignicons.css';

const router = useRouter()
const isLoading = ref(false)
const slides = ref([])
const current = ref(0)

const abrirFilme = (id) => {
  router.push({ name: 'MovieView', params: { id } })
}

const carregarSlides = async () => {
  isLoading.value = true

  try {
    const { data } = await api.get('/movie/popular')

    slides.value = await Promise.all(
      data.results.slice(0, 6).map(async (filme) => {
        const detalhes = await api.get(`/movie/${filme.id}`)
        return {
          id: filme.id,
          title: filme.title,
          description: filme.overview || 'Sem descrição.',
          image: `https://image.tmdb.org/t/p/original${filme.backdrop_path || filme.poster_path}`,
          duration: detalhes.data.runtime ? `${detalhes.data.runtime}m` : '—'
        }
      })
    )
  } finally {
    isLoading.value = false
  }
}


onMounted(async () => {
  await carregarSlides()
  setInterval(() => current.value = (current.value + 1) % slides.value.length, 9000)
})
</script>

<template>
  <Loading
    v-model:active="isLoading"
    :is-full-page="true"
    color="#ffffff"
    background-color="rgba(0, 0, 0, 0.8)"
    loader="dots"
  />

  <div v-if="slides.length" class="carousel">
    <div class="slide" :style="{ backgroundImage: `url(${slides[current].image})` }">
      <div class="overlay"></div>
      <div class="conteudo">
        <div class="texto">
          <h1>{{ slides[current].title }}</h1>
          <p class="tempo">{{ slides[current].duration }}</p>
          <p class="descricao">{{ slides[current].description }}</p>
          <button class="assistir" @click="abrirFilme(slides[current].id)">▶ Assistir Agora</button>
        </div>
      </div>
      <div class="controles">
        <button @click="current = (current - 1 + slides.length) % slides.length">⟨</button>
        <button @click="current = (current + 1) % slides.length">⟩</button>
      </div>
    </div>
  </div>

</template>


<style scoped>

  .carousel {
    width: 100%;
    height: 80vh;
    overflow: hidden;
    position: relative;
    color: white;
    font-family: 'Inter', sans-serif;
  }

  .slide {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center right;
    position: relative;
    display: flex;
    align-items: center;
    transition: background-image 0.6s ease-in-out;
  }

  .overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.9) 40%, rgba(0, 0, 0, 0.3) 90%);
  }

  .conteudo {
    position: relative;
    z-index: 2;
    padding-left: 6rem;
    width: 45%;
  }

  .texto h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.4rem;
  }

  .texto .tempo {
    opacity: 0.8;
    margin-bottom: 1rem;
  }

  .texto .descricao {
    font-size: 1.1rem;
    opacity: 0.9;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }

  .assistir {
    background: rgba(245, 179, 83, 1);
    color: #000;
    padding: 1rem 3.5rem;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .assistir:hover {
    background: rgba(245, 179, 83, 1);
  }

  .controles {
    position: absolute;
    bottom: 30px;
    right: 50px;
    display: flex;
    gap: 10px;
    z-index: 2;
  }

  .controles button {
    background: rgba(255, 255, 255, 0.25);
    color: white;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    font-size: 22px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .controles button:hover {
    background: rgba(255, 255, 255, 0.45);
  }

  .loading {
    text-align: center;
    color: #fff;
    font-family: 'Inter', sans-serif;
    padding: 4rem;
  }
</style>
