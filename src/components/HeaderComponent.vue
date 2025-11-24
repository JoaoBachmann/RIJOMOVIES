<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
const opcoesP = ref(false)
const paises = ref([])



const abrirPais = (pais) => {
    router.push({ 
        name: 'PaisView', 
        params: { id: pais.iso_3166_1 },
        query: { name: pais.native_name || pais.english_name}
    })
}
const router = useRouter()


const opcoesA = ref(false)
const atores = ref([])


const abrirAtor = (ator) => {
    router.push({ 
        name: 'AtorView', 
        params: { id: ator.id }
    })
}


const getCountries = async () => {
  try {
    const { data } = await api.get('/configuration/countries')
    paises.value = data
  } catch (error) {
    console.error('Erro ao buscar países:', error)
  }
}
const getActors = async () => {
  try {
    let allActors = []
    for (let page = 1; page <= 20; page++) {
      const { data } = await api.get(`/person/popular?page=${page}`)
      allActors.push(...data.results)
    }
    atores.value = allActors
  } catch (error) {
    console.error('Erro ao buscar atores:', error)
  }
}
const atoresFamosos = computed(() => {
  return atores.value.filter(ator => ator.popularity >= 5)
})


const searchA = ref('')

const filteredAtores = computed(() => {
  if (!searchA.value) return atoresFamosos.value
  return atoresFamosos.value.filter(ator =>
    ator.name.toLowerCase().includes(searchA.value.toLowerCase())
  )
})


const searchP = ref('');
const filteredCountry = computed(() => {
  const paisesSearch = [];

  for (const pais of paises.value) {
    const nomePais = pais.native_name || pais.english_name;
    if (!searchP.value || nomePais.toLowerCase().includes(searchP.value.toLowerCase())) {
      paisesSearch.push(pais);
    }
  }

  return paisesSearch;
});


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
          <div class="selected"><input type="text" id="search-country" name="search-country" v-model="searchP"
              placeholder="Pesquisar país..."></div>
          <ul v-show="opcoesP" class="options">
            <li v-for="pais in filteredCountry" :key="pais.iso_3166_1" @click="abrirPais(pais)"> 
                 {{ pais.native_name || pais.english_name }}
            </li>
          </ul>
        </div>
      </div>

      <div class="container" @click="opcoesA=true" @mouseleave="opcoesA = false">
        <button>Atores</button>
        <div class="custom-selectA" v-if="opcoesA">
          <div class="selected"><input type="text" id="search-actor" name="search-actor" v-model="searchA"
              placeholder="Pesquisar ator famoso..." /></div>
          <ul v-if="filteredAtores.length" class="options">
            <li v-for="ator in filteredAtores" :key="ator.id" @click="opcoesA = false; abrirAtor(ator)">
              {{ ator.name }} — {{ ator.popularity.toFixed(1) }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="Pesquisar..." />
      <span class="mdi mdi-magnify"></span>
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

    & span {
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
    background:  black;
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
</style>
