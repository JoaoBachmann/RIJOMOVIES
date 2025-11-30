<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const paisCode = ref(route.params.id)
const paisNome = computed(() => route.query.name)
const filmes = ref([])
const carregando = ref(true)


const getFilmesPorPais = async () => {
  try {
const todasPaginas = []

    // Busca as páginas 1 a 4
    for (let page = 1; page <= 4; page++) {
      const { data } = await api.get('/discover/movie', {
        params: {
          with_origin_country: paisCode.value,
          sort_by: 'popularity.desc',
          page,
        },
      })

      todasPaginas.push(...data.results)
    }


    const filmesComRuntime = await Promise.all( // Promise.all espera tudo ser resolvido antes de continuar
      todasPaginas.map(async (filme) => {//.map percorre cada filme do array
         // para cada filme, faz uma requisição para pegar os detalhes
         // e retorna um novo objeto com o runtime adicionado
        try {
          const { data: detalhes } = await api.get(`/movie/${filme.id}`)
          return { ...filme, runtime: detalhes.runtime }
        } catch {
          return { ...filme, runtime: null }
        }
      })
    )

    filmes.value = filmesComRuntime // atribui o array com runtime ao ref filmes
  } catch (err) {
    console.error("Erro ao buscar filmes:", err)
  } finally {
    carregando.value = false
  }
}
const tamanhoGrupo = 10 

const filmesAgrupados = computed(() => {
  const grupos = []
  for (let i = 0; i < filmes.value.length; i += tamanhoGrupo) {
    grupos.push(filmes.value.slice(i, i + tamanhoGrupo)) // divide os filmes em grupos de tamanho definido
    // i = inicio e i + tamanhoGrupo = fim do slice, 0-10, 10-20...
  }
  return grupos
})



onMounted(() => {
  getFilmesPorPais()
})

watch(
  () => route.fullPath, //observa toda a rota para pegar mudanças em query params
  () => {
    paisCode.value = route.params.id // atualiza po codigo do pais
    getFilmesPorPais() // carrega os filmes do novo pais
  },
)

const carrosseis = ref([])

const rolar = (index, direcao) => {
  const container = carrosseis.value[index] // index = qual carrosel rolar
  if (!container) return // sem carrosel a funcao para

  const largura = container.clientWidth // largura visivel do carrosel
  // a largura vai ser usada para determinar quanto rolar

  container.scrollBy({
    left: direcao === 'direita' ? largura : -largura, // direita = largura, esquerda = -largura
    behavior: 'smooth', // animacao
  })
}


const abrirFilme = (id) => {
  router.push({ name: 'MovieView', params: { id } })
}

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
  :src="filme.poster_path 
        ? 'https://image.tmdb.org/t/p/w500' + filme.poster_path 
        : '/public/sem-poster.png'"
  :alt="filme.title"
/>

      <h2>{{ filme.title }}</h2>
      <p>{{ filme.runtime ? filme.runtime + ' min' : 'Não informado' }}</p>
    </div>
  </div>

  <button class="seta direita" @click="rolar(index, 'direita')">></button>
</div>

</template>

<style scoped>
h1{
  margin-left: 2.7vw;
  width: fit-content;
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
  margin: 0 1.5vw;
  padding-bottom: 2vw;

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
  width: 200px;   
  height: auto;         
  object-fit: cover;     
  border-radius: 8px;
  transition: transform .2s;
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
