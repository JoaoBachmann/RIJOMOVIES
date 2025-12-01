<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'

const opcoesP = ref(false)
const paises = ref([])
const router = useRouter()
const opcoesA = ref(false)
const atores = ref([])
const searchA = ref('')
const searchP = ref('')
const busca = ref('')
const resultadosBusca = ref([])

const pesquisarFilmes = async () => {
  if (!busca.value.trim()) {
    resultadosBusca.value = []
    return
  }

  try {
    const resultados = []

    
    for (let page = 1; page <= 3; page++) {
      const { data } = await api.get('/search/movie', {
        params: {
          query: busca.value,
          include_adult: false,
          language: 'pt-BR',
          page: page,
        },
      })

      resultados.push(...data.results)
    }

    resultadosBusca.value = resultados
  } catch (err) {
    console.error('Erro ao pesquisar filmes:', err)
  }
}


const abrirFilme = (id) => {
  busca.value = '' // limpa o campo de busca
  resultadosBusca.value = [] // limpa os resultados da busca
  router.push({ name: 'MovieView', params: { id } })
}

const abrirPais = (pais) => {
  router.push({
    name: 'PaisView',
    params: { id: pais.iso_3166_1 },
    query: { name: pais.native_name || pais.english_name },
  })
}

const abrirAtor = (ator) => {
  router.push({
    name: 'AtorView',
    params: { id: ator.id },
  })
}

const getCountries = async () => {
  try {
    const { data } = await api.get('/configuration/countries') // Quando puxamos da api vem mais de uma coisa, nos so pegamos o data. O await espera a resposta da api
    paises.value = data // aqui armazenamos a data em paises
  } catch (error) {
    console.error('Erro ao buscar países:', error)
  }
}

const getActors = async () => {
  try {
    let allActors = []
    for (let page = 1; page <= 20; page++) {
      // vai buscar na api 20 paginas dos atores
      const { data } = await api.get(`/person/popular?page=${page}`) //por isso colocamos esse ${page}, pq cada vez qu o page aumentar um numero ali muda a url tmb
      allActors.push(...data.results) //data.results é o array de atores. O ... espalha os atores dentro do allActors
    }
    atores.value = allActors
  } catch (error) {
    console.error('Erro ao buscar atores:', error)
  }
}

const atoresFamosos = computed(() => {
  const popularity = []
  for (const ator of atores.value) {
    if (ator.popularity >= 5) popularity.push(ator)
  }
  return popularity
})

const filteredAtores = computed(() => {
  if (!searchA.value) {
    return atoresFamosos.value
  } else {
    const pesquisado = []
    for (const ator of atoresFamosos.value) {
      if (ator.name.toLowerCase().includes(searchA.value.toLowerCase())) {
        pesquisado.push(ator)
      }
    }

    return pesquisado
  }
})

const filteredCountry = computed(() => {
  const paisesSearch = []

  for (const pais of paises.value) {
    const nomePais = pais.native_name || pais.english_name // o // (ou) é para validar tanto o nome inteiro quando a abrevaicao
    if (!searchP.value || nomePais.toLowerCase().includes(searchP.value.toLowerCase())) {
      paisesSearch.push(pais)
    }
  }

  return paisesSearch
})

onMounted(() => {
  getCountries()
  getActors()
})
</script>

<template>
  <header>
    <div class="logo_Btn-filmes">
      <router-link to="/"><img src="/public/RiJoMovies.png" alt="RijoMovies Logo" /></router-link>

      <div class="container" @mouseleave="opcoesP = false" @click="opcoesP = true">
        <button>Filmes</button>

        <div class="custom-selectP" v-if="opcoesP">
          <div class="selected">
            <input
              type="text"
              id="search-country"
              name="search-country"
              v-model="searchP"
              placeholder="Pesquisar país..."
              autocomplete="off"
            />
          </div>
          <ul v-show="opcoesP" class="options">
            <li
              v-for="pais in filteredCountry"
              :key="pais.iso_3166_1"
              @click.stop="
                abrirPais(pais);
                searchP = '';
                opcoesP = false
              "
            >
                  {{ pais.native_name || pais.english_name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="container" @click="opcoesA = true" @mouseleave="opcoesA = false">
        <button>Atores</button>
        <div class="custom-selectA" v-if="opcoesA">
          <div class="selected">
            <input
              type="text"
              id="search-actor"
              name="search-actor"
              v-model="searchA"
              placeholder="Pesquisar ator famoso..."
              autocomplete="off"
            />
          </div>
          <ul v-if="filteredAtores.length" class="options">
            <li
              v-for="ator in filteredAtores"
              :key="ator.id"
              @click.stop=" searchA = ''; abrirAtor(ator); opcoesA = false"
            >
              {{ ator.name }} — {{ ator.popularity.toFixed(1) }}
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="search">
      <input type="text" placeholder="Pesquisar..." v-model="busca" @keyup="pesquisarFilmes"/>
      <span class="btn-pesquisa mdi mdi-magnify" @click="pesquisarFilmes()"></span>
      <!--Da de colocar duas classe juntas-->


      <ul v-if="resultadosBusca.length" class="resultados-busca">
        <li
          v-for="filme in resultadosBusca"
          :key="filme.id" @click="abrirFilme(filme.id)" class="item-busca"
        >
          <img
            :src="`https://image.tmdb.org/t/p/w92${filme.poster_path}`" alt="Poster" class="poster-busca"
          />
          <span>{{ filme.title }}</span>
        </li>
      </ul>
    </div>

    <div class="perfil_Btn-login">
      <button>Entrar</button>
      <button>Cadastrar</button>
    </div>
  </header>
</template>

<style scoped>
header {
  background-color: black;
  display: flex;
  justify-content: space-between;
  padding: 0 1vw;
  position: relative;
  z-index: 10;

  & img {
    height: 70px;
    margin: 10px 40px 5px 30px;
  }

  & .logo_Btn-filmes {
    display: flex;
    align-items: center;
    gap: 60px;

    & button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    & button:hover {
      color: rgba(245, 179, 83, 1);
    }

    & .container {
      & button:first-child {
        padding: 31px 0;
      }
    }
  }

  & .search {
    display: flex;
    align-items: center;
    position: relative;

    & input {
      width: 500px;
      height: 40px;
      border-radius: 5px;
      border: none;
      padding: 5px 10px;
      font-size: 16px;
    }

    & span.btn-pesquisa {
      font-size: 25px;
      position: absolute;
      right: 10px;
    }
  }

  & .perfil_Btn-login {
    display: flex;
    align-items: center;
    gap: 60px;
    margin: 0 60px 0 0;

    & button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    & button:hover {
      color: rgba(245, 179, 83, 1);
    }

    & .perfil {
      font-size: 30px;
    }
  }
}

.custom-selectP {
  width: 200px;
  background: black;
  color: white;
  border: 1px solid rgba(245, 179, 83, 1);
  border-radius: 5px;
  position: absolute;
  cursor: pointer;
  left: 200px;
}

.custom-selectP .selected {
  padding: 8px 10px;

  & input {
    width: 180px;
    background: black;
    border: none;
    color: white;
    outline: none;
  }
}

.custom-selectP .options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: black;
  border: 1px solid rgba(245, 179, 83, 1);
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.custom-selectP .options li {
  padding: 8px 10px;
}

.custom-selectP .options li:hover {
  background: rgb(40, 40, 40);
}

.custom-selectA {
  width: 200px;
  height: auto;
  padding-right: 10px;
  background: black;
  color: white;
  border: 1px solid rgba(245, 179, 83, 1);
  border-radius: 5px;
  position: absolute;
  cursor: pointer;
  left: 340px;
  top: 85px;
}

.custom-selectA .selected {
  padding: 8px 10px;

  & input {
    width: 180px;
    background: black;
    border: none;
    color: white;
    outline: none;
  }
}

.custom-selectA .options {
  position: absolute;
  left: 0;
  width: 100%;
  background: black;
  border: 1px solid rgba(245, 179, 83, 1);
  border-radius: 5px;
  max-height: 200px;
  overflow: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.custom-selectA .options li {
  padding: 8px 10px;
}

.custom-selectA .options li:hover {
  background: rgb(40, 40, 40);
}

.resultados-busca {
  position: absolute;
  top: 67px;
  width: 500px;
  background: black;
  color: white;
  list-style: none;
  padding: 0;
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid rgba(245, 179, 83, 1);
  border-radius: 5px;
  z-index: 20;
}

.resultados-busca li {
  padding: 10px;
  cursor: pointer;
}
.resultados-busca span {
  
}
.resultados-busca li:hover {
  background: rgb(40, 40, 40);
}

.item-busca {
  display: flex;
  align-items: center;
  gap: 10px;
}

.poster-busca {
  margin: 0;
  margin-left: 20px;
  width: 60px;
  height: auto;
  border-radius: 4px;
}

</style>
