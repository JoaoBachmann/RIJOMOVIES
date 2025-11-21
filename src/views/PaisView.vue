<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const paisCode = ref(route.params.id)
const paisNome = route.query.name

const filmes = ref([])
const carregando = ref(true)

const getFilmesPorPais = async () => {
  try {

    const { data: data1 } = await api.get('/discover/movie', {
      params: {
        with_origin_country: paisCode.value,
        sort_by: 'popularity.desc',
        page: 1,
      },
    })


    const { data: data2 } = await api.get('/discover/movie', {
      params: {
        with_origin_country: paisCode.value,
        sort_by: 'popularity.desc',
        page: 2,
      },
    })

    //Fazer um for que leia de um const que tenha uma qunatidade e essa contidade leia mais pagina, para automatizar.


    const filmesBrutos = [...data1.results, ...data2.results]


    const filmesComRuntime = await Promise.all(
      filmesBrutos.map(async (filme) => {
        try {
          const { data: detalhes } = await api.get(`/movie/${filme.id}`)
          return { ...filme, runtime: detalhes.runtime }
        } catch {
          return { ...filme, runtime: null }
        }
      })
    )

    filmes.value = filmesComRuntime
  } catch (err) {
    console.error("Erro ao buscar filmes:", err)
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

const carrosseis = ref([])

const rolar = (index, direcao) => {
  const container = carrosseis.value[index]
  if (!container) return

  const largura = container.clientWidth

  container.scrollBy({
    left: direcao === 'direita' ? largura : -largura,
    behavior: 'smooth',
  })
}


const tamanhoGrupo = 15 // pode ser 7, 8, 10...

const filmesAgrupados = computed(() => {
  const grupos = []
  for (let i = 0; i < filmes.value.length; i += tamanhoGrupo) {
    grupos.push(filmes.value.slice(i, i + tamanhoGrupo))
  }
  return grupos
})

</script>

<template>
  <h1>{{ paisNome }} - {{ paisCode }}</h1>

  <p v-if="carregando">Carregando...</p>

  <div
  v-for="(grupo, index) in filmesAgrupados"
  :key="index"
  class="carrossel-container"
>
  <button class="seta esquerda" @click="rolar(index, 'esquerda')"><</button>

  <div class="carrossel" :ref="el => carrosseis[index] = el">
    <div
      v-for="filme in grupo"
      :key="filme.id"
      class="filme"
      @click="abrirFilme(filme.id)"
    >
      <img
        :src="'https://image.tmdb.org/t/p/w500' + filme.poster_path"
        :alt="filme.title"
      />
      <h2>{{ filme.title }}</h2>
      <p>{{ filme.runtime }} min</p>
    </div>
  </div>

  <button class="seta direita" @click="rolar(index, 'direita')">></button>
</div>

</template>

<style scoped>
h1{
  margin-left: 2.7vw;
  width: 200px;
  border-radius: 8px;
  color: black;
  padding: 10px;
  margin-bottom: 3vw;
  background-color: rgba(245, 179, 83, 1);
}
h2{
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
  margin: 0 1vw;
}

.carrossel {
  display: flex;
  gap: 30px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding-bottom: 10px;
  scrollbar-width: none;
}
.carrossel img{
  width: 500px;
  max-height: 281px;
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
  left: 10px;
}

.seta.direita {
  right: 10px;
}
</style>
