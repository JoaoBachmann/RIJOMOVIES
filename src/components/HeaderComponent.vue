<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'
const opcoes = ref(false)
const paises = ref([])
const selected = ref(null) // aqui vai o país escolhido

const getCountries = async () => {
  try {
    const { data } = await api.get('/configuration/countries')
    paises.value = data
  } catch (error) {
    console.error('Erro ao buscar países:', error)
  }
}
onMounted(() => {
  getCountries()
})
</script>

<template>
  <header>
    <div class="logo_Btn-filmes">
      <img src="/public/RiJoMovies.png" alt="RijoMovies Logo" />

      <div class="filmes-container" @mouseenter="opcoes = true" @mouseleave="opcoes = false">
        <button>Filmes</button>

        <div class="custom-select" v-if="opcoes">
          <div class="selected">{{ 'Selecione um país' }}</div>
          <ul v-show="opcoes" class="options">
            <li
              v-for="pais in paises"
              :key="pais.iso_3166_1"
              @click="
                selected = pais.native_name || pais.english_name;
                opcoes = false
              "
            >
              {{ pais.native_name || pais.english_name }}
            </li>
          </ul>
        </div>
      </div>

      <button>Atores</button>
    </div>
    <div class="search">
      <input type="text" placeholder="Pesquisar..." />
      <span class="mdi mdi-magnify"></span>
    </div>
    <div class="perfil_Btn-login">
      <button>Login</button>
      <button>Entrar</button>
    </div>
  </header>
  <p>{{ selected }}</p>
  <p>{{ atores }}</p>
</template>

<style scoped>
header {
  background-color: black;
  display: flex;
  justify-content: space-between;

  & img {
    height: 70px;
    margin: 10px 40px 5px 30px;
  }

  & .logo_Btn-filmes {
    display: flex;
    align-items: center;
    gap: 80px;

    & button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    & button:hover {
      color: rgb(255, 0, 0);
    }
    & .filmes-container {
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
      width: 700px;
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
    padding-left: 70px;

    & button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    & button:hover {
      color: rgb(255, 0, 0);
    }
    & .perfil {
      font-size: 30px;
    }
  }
}
.custom-select {
  width: 200px;
  background: black;
  color: white;
  border: 1px solid red;
  border-radius: 5px;
  position: absolute;
  cursor: pointer;
  left: 200px;
}

.custom-select .selected {
  padding: 8px 10px;
}

.custom-select .options {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: black;
  border: 1px solid red;
  border-radius: 5px;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: 0;
  z-index: 10;
}

.custom-select .options li {
  padding: 8px 10px;
}

.custom-select .options li:hover {
  background: rgb(40, 40, 40);
}
</style>
