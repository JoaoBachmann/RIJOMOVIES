<script setup> 
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const filme = ref(null)
const trailer = ref(null)

onMounted(async () => {
  const id = route.params.id
  const { data } = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' }
  })

  filme.value = data

  const video = data.videos.results.find(
    (v) => v.type === 'Trailer' && v.site === 'YouTube'
  )

  trailer.value = video || data.videos.results[0] || null
})
</script>

<template>
  <div v-if="filme" class="movie-view">
    <div class="informacao">
      <h1>{{ filme.title }}</h1>
      <p class="p">{{ filme.overview }}</p>
      <p class="runtime"><strong>Runtime:</strong> {{ filme.runtime }} min</p>
      <p class="release"><strong>Release:</strong> {{ filme.release_date }}</p>
      <p class="vote"><strong>Rating:</strong> ⭐ {{ filme.vote_average.toFixed(1) }}</p>

      <div v-if="trailer" class="trailer">
        <h2>Trailer</h2>
        <iframe
          width="560"
          height="315"
          :src="`https://www.youtube.com/embed/${trailer.key}`"
          title="Trailer"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </div>

    <img
      class="backdrop"
      :src="`https://image.tmdb.org/t/p/original${filme.backdrop_path}`"
      :alt="filme.title"
    />
  </div>
</template>

<style scoped>
.movie-view {
  color: white;
  font-family: 'Inter', sans-serif;
  padding: 60px 40px;
  display: flex;
}

.movie-view h1 {
  padding: 0 0 0 20px;
  font-size: 3vw;
  margin-bottom: 20px;
}

.movie-view .p {
  text-indent: 2vw;
  font-size: 1vw;
  margin-bottom: 1.5vw;
}

.movie-view .runtime,
.release,
.vote {
  font-size: 1vw;
}
/*imagem do filme*/ 
.backdrop {
  width: 50%;
  max-height: 100vh;
  padding: 0 2vw;
  border-radius: 2vw;
  object-fit: cover;
}

.trailer {
  margin-top: 2vw;
  padding: 0 0 0 2vw;
}

.trailer h2 {
  font-size: 1.3vw;
  margin-bottom: 1vw;
  padding: 0 0 0 14.5vw;
}

.trailer iframe {
  width: 100%;
  max-width: 560px;
  height: 315px;
  border-radius: 1vw;
}
</style>
