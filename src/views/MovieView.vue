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
    params: { append_to_response: 'credits,videos' },
  })

  filme.value = data

  const diretor = data.credits.crew.find((pessoa) => pessoa.job === 'Director')
  filme.value.director = diretor ? diretor.name : 'Desconhecido'

  filme.value.genresList = data.genres.map((g) => g.name).join(', ')

  const atorPrincipal = data.credits.cast[0]
  filme.value.mainActor = atorPrincipal ? atorPrincipal.name : 'Desconhecido'

  const video = data.videos.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube')

  trailer.value = video || data.videos.results[0] || null
})
</script>

<template>
  <div v-if="filme" class="movie-view">
    <img
      class="backdrop"
      :src="`https://image.tmdb.org/t/p/original${filme.backdrop_path}`"
      :alt="filme.title"
    />

    <div class="informacao">
      <div class="direito">
        <h1>{{ filme.title }}</h1>
        <p class="p">&nbsp;&nbsp;&nbsp;&nbsp;{{ filme.overview }}</p>

        <div class="ator">
          <p class="color">Principal Actor</p>
          <router-link :to="`/ator/${filme.credits.cast[0].id}`" class="link-ator">
            {{ filme.mainActor }}
          </router-link>
        </div>
      </div>

      <div class="esquerdo">
        <div class="line">
          <div>
            <p><strong>Director:</strong></p>
            <p>{{ filme.director }}</p>
          </div>

          <div>
            <p class="runtime"><strong>Runtime:</strong></p>
            <p>{{ filme.runtime }} min</p>
          </div>

          <div>
            <p class="release"><strong>Release:</strong></p>
            <p>{{ filme.release_date }}</p>
          </div>

          <div>
            <p class="vote"><strong>Rating:</strong></p>
            <p>{{ filme.vote_average.toFixed(1) }}⭐</p>
          </div>

          <div>
            <p class="genres"><strong>Genres:</strong></p>
            <p>{{ filme.genresList }}</p>
          </div>
        </div>
        <div v-if="trailer" class="trailer">
          <iframe
            width="460"
            height="250"
            :src="`https://www.youtube.com/embed/${trailer.key}`"
            title="Trailer"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-view {
  position: relative;
  min-height: 100vh;
  color: white;
  overflow: hidden;
}

/*imagem de fundo*/
.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.4);
  z-index: 0;
}

.informacao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 0 6rem;
}

.direito {
  max-width: 40%;
}

.direito h1 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.direito .p {
  font-size: 1rem;
}

.direito .color {
  color: rgb(150, 150, 150);
  font-size: 1.5rem;
  margin-top: 9rem;
}
.direito .ator {
  margin-top: 3rem;
}

.link-ator {
  color: white;
  text-decoration: none;
}

.line {
  border-top: 1px solid rgb(84, 84, 84);
  margin-top: 3vw;
}

.esquerdo {
  max-width: 40%;
  text-align: right;
  line-height: 1.6rem;
  border-left: 1px solid rgb(95, 95, 95);
  border-top: 1px solid rgb(84, 84, 84);
}

.esquerdo p {
  font-size: 1rem;
}

.esquerdo p strong {
  font-weight: bold;
  font-size: 1.2rem;
  color: rgb(137, 137, 137);
}

.esquerdo div {
  margin-bottom: 1rem;
  padding: 0.7vw 0 0 0;
}
</style>
