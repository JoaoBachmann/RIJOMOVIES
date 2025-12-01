<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const router = useRouter()
const abrirFilme = (id) => {
    router.push({ name: 'MovieView', params: { id } })
}

const route = useRoute()
const ator = ref(null)

onMounted(async () => {
    const id = route.params.id
    const { data } = await api.get(`person/${id}`, {
        params: {
            append_to_response: 'movie_credits'
        }
    })
    ator.value = data
})
</script>

<template>
    <div v-if="ator" class="actor-view">
        <div class="actor-viewT">
            <!--efeito borrado do ator-->
            <img 
                class="backdrop-blur" 
                :src="`https://image.tmdb.org/t/p/original${ator.profile_path}`" 
                :alt="ator.name"
            />
            <img 
                class="backdrop" 
                :src="`https://image.tmdb.org/t/p/original${ator.profile_path}`" 
                :alt="ator.name"
            />
            <h1>{{ ator.name }}</h1>
        </div>

        <div class="informacao">
            <h1>{{ ator.name }}</h1>
            <p><strong>Birthday:</strong> {{ ator.birthday }}</p>
            <p><strong>Place of Birth:</strong> {{ ator.place_of_birth }}</p>
            <p class="bio"><strong>Biography:</strong></p>
            <p class="bio-text">{{ ator.biography }}</p>
        </div>

        <!-- FILMES -->
        <div class="filmes">
            <h2>Filmes</h2>

            <div class="filmes-grid">
                <div 
                    class="filme-card"
                    v-for="filme in ator.movie_credits.cast"
                    :key="filme.id"
                    @click="abrirFilme(filme.id)"
                >
                    <img 
                        class="poster"
                        :src="filme.poster_path 
                            ? `https://image.tmdb.org/t/p/w300${filme.poster_path}` 
                            : '/fallback.jpg'"
                    />
                    <p class="titulo">{{ filme.title }}</p>
                    <p class="personagem">{{ filme.character }}</p>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.actor-view {
    background-color: black;
    color: white;
    padding-bottom: 40px;
}

/* BANNER */
.actor-viewT {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.backdrop-blur {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(30px) brightness(0.4);
  top: 0;
  left: 0;
  z-index: 0;
}

.backdrop {
  position: relative;
  height: 100%;
  width: auto;
  object-fit: contain;
  z-index: 1;
}

.actor-viewT h1 {
    position: absolute;
    bottom: 20px;
    font-size: 2.5rem;
    z-index: 2;
    text-shadow: 0 0 10px black;
}

/* INFORMAÇÕES */
.informacao {
    padding: 30px;
    font-size: 1.1rem;
    line-height: 1.6;
}

.bio-text {
    max-width: 900px;
}

/* FILMES */
.filmes {
  margin: 30px;
}

.filmes h2 {
  margin-bottom: 20px;
  font-size: 2rem;
}

.filmes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
}

.filme-card {
  background: #111;
  padding: 10px;
  border-radius: 10px;
  text-align: center;
  transition: transform .2s;
}

.filme-card:hover {
  transform: scale(1.05);
}

.poster {
  width: 100%;
  border-radius: 10px;
}

.titulo {
  font-weight: bold;
  margin-top: 10px;
}

.personagem {
  font-size: .9rem;
  opacity: .8;
}
</style>
