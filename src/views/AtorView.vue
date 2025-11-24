<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()

const ator = ref(null)
const credits = ref(null)
const filmesAtor = ref([])
const offset = ref(0)

const getFilmesDoAtor = async (idAtor) => {
  const { data } = await api.get(`/person/${idAtor}/movie_credits`)
  filmesAtor.value = data.cast
}

const next = () => {
  offset.value -= 165
}

const prev = () => {
  if (offset.value < 0) offset.value += 165
}

watch(
  () => route.params.id,
  (novoId) => {
    if (novoId) carregarAtor(novoId)
  },
)
const carregarAtor = async (id) => {
  const { data } = await api.get(`/person/${id}`, {
    params: { append_to_response: 'combined_credits,images,external_ids' },
  })

  ator.value = data
  credits.value = data.combined_credits

  const social = data.external_ids

  ator.value.links = {
    instagram: social.instagram_id ? `https://instagram.com/${social.instagram_id}` : null,
    facebook: social.facebook_id ? `https://facebook.com/${social.facebook_id}` : null,
    twitter: social.twitter_id ? `https://twitter.com/${social.twitter_id}` : null,
  }

  ator.value.topWorks = data.combined_credits.cast
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5)

  await getFilmesDoAtor(id)
  offset.value = 0 // ZERA o carrossel quando muda de ator
}

onMounted(() => {
  carregarAtor(route.params.id)
})


const abrirFilme = (id) => {
  router.push({ name: 'MovieView', params: { id } })
}

</script>

<template>
  <div v-if="ator" class="movie-view">
    <img
      class="backdrop"
      :src="
        ator.images?.profiles?.length
          ? 'https://image.tmdb.org/t/p/original' + ator.images.profiles[0].file_path
          : 'https://image.tmdb.org/t/p/original' + ator.profile_path
      "
      :alt="ator.name"
    />

    <div class="informacao">
      <div class="direito">
        <h1>{{ ator.name }}</h1>
      </div>

      <!-- LADO DIREITO -->
      <div class="esquerdo">
        <h2>Biografia</h2>
        <p class="p bio">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ ator.biography || 'Sem biografia disponível.' }}
        </p>
        <div class="social">
          <a v-if="ator?.links?.instagram" :href="ator.links.instagram" target="_blank"
            ><span class="mdi mdi-instagram"></span
          ></a>
          <a v-if="ator?.links?.facebook" :href="ator.links.facebook" target="_blank"
            ><span class="mdi mdi-facebook"></span
          ></a>
          <a v-if="ator?.links?.twitter" :href="ator.links.twitter" target="_blank"
            ><span class="mdi mdi-twitter"></span
          ></a>
        </div>
      </div>
    </div>

    <div class="under">
      <ul>
        <li>
          <p class="label">Creditado(a) em</p>
          <p>{{ (credits?.cast?.length || 0) + (credits?.crew?.length || 0) }} obras</p>
        </li>

        <li>
          <p class="label">Nascimento:</p>
          <p>{{ ator.birthday || 'Desconhecido' }}</p>
        </li>

        <li>
          <p class="label">Popularidade:</p>
          <p>{{ ator.popularity.toFixed(1) }} ⭐</p>
        </li>

        <li>
          <p class="label">Local:</p>
          <p>{{ ator.place_of_birth || 'Desconhecido' }}</p>
        </li>
      </ul>
    </div>
    <h2>Conhecido(a) por</h2>
    <div class="carousel-container">
      <button class="carousel-btn prev" @click="prev">‹</button>

      <div class="carousel" :style="{ transform: `translateX(${offset}px)` }">
        <div class="carousel-item" @click="abrirFilme(filme.id)" v-for="filme in filmesAtor" :key="filme.id">
          <img
            :src="
              filme.poster_path
                ? `https://image.tmdb.org/t/p/w200${filme.poster_path}`
                : '/public/sem-poster.png'
            "
            :alt="filme.title"
          />

          <p class="titulo-filme">{{ filme.title }}</p>
        </div>
      </div>

      <button class="carousel-btn next" @click="next">›</button>
    </div>
  </div>
</template>
<style scoped>
.movie-view {
  position: relative;
  min-height: 130vh;
  color: white;
  overflow-x: hidden;
  overflow-y: visible;
}

.backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 65%;
  object-fit: cover;
  filter: brightness(0.4);
  z-index: 0;
  max-height: 797px;
}

.esquerdo h2 {
  font-size: 2rem;
  margin: 1rem 0;
}
h2{
    font-size: 2.4rem;
    margin-left: 2rem;
    margin-top: 2rem;
}
.bio {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.bio::-webkit-scrollbar {
  width: 6px;
}

.bio::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 8px;
}
.social {
  display: flex;
  gap: 1rem;
  justify-content: center;
  font-size: 1.9rem;
  gap: 0.5rem;
  margin-top: 6vh;
}
.social a {
  padding: 8px 14px;
  border-radius: 6px;

  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: 0.2s;
}

.social a:hover {
  background: rgba(255, 255, 255, 0.3);
}

.social .mdi-instagram {
  color: #e1306c;
}
.social .mdi-facebook {
  color: #1877f2;
}
.social .mdi-twitter {
  color: #1da1f2;
}

.informacao {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  z-index: 1;
  padding: 0 2rem;
}

.direito h1 {
  font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
  font-size: 8rem;
  margin-bottom: 1rem;
  position: absolute;
  top: 95vh;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  display: flex;
  justify-content: center;
}

.direito .p {
  font-size: 1rem;
}

.direito .color {
  font-size: 1.5rem;
  margin-top: 9rem;
}
.direito .ator {
  margin-top: 3rem;
}

.esquerdo {
  max-width: 30%;
  text-align: left;
  line-height: 1.6rem;
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

.under {
  position: relative;
  z-index: 2;
  width: 100%;
  background: #000;
  padding: 3rem 0;
  margin-top: 60vw;
  display: flex;
  justify-content: center;
}

.under ul {
  list-style: none;
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 0;
  margin: 0;
}

.under .label {
  color: #b5b5b5;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 4px;
}
.under li {
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.08);
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 230px;
  text-align: center;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: 0.3s;
}
.under li:hover {
  transform: translateY(-6px);
  background: rgba(255, 255, 255, 0.15);
}
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin: 0 1rem;
  height: 450px;
  display: flex;
  align-items: center;
}

.carousel {
  display: flex;
  gap: 15px;
  transition: transform 0.3s ease-in-out;
}

.carousel-item {
  min-width: 190px;
  text-align: center;
  
}

.carousel-item img {
  width: 100%;
  height: 270px;
  object-fit: cover;
  border-radius: 10px;
}

.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #00000088;
  border: none;
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  font-size: 22px;
  border-radius: 5px;
  z-index: 5;
}

.carousel-btn.prev {
  left: 5px;
}

.carousel-btn.next {
  right: 20px;
}

.titulo-filme {
  color: white;
  margin-top: 5px;
  font-size: 14px;
}
</style>
