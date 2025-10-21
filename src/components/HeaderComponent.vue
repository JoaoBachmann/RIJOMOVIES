<script setup>
import { ref } from 'vue'

const opcoes = ref(false)
</script>

<template>
  <header>
    <div class="logo_Btn-filmes">
    <img src="/public/RiJoMovies.png" alt="RijoMovies Logo" />
    <button @click="opcoes = true">Filmes</button>
    </div>
    <div class="search">
      <input type="text" placeholder="Pesquisar..." />
    </div>
    <div class="perfil_Btn-login">
    <button>Login</button>
    <button>Entrar</button>
    </div>



    <div v-if="opcoes">
      <select name="paises" id="paises">
        <!--Aqui vou ter q pegar da api os países. E provavelmente colocar a api no pai e mandar as infos para os filhos-->
      </select>
    </div>
  </header>
</template>

<style  scoped>
header {
  background-color: black;
  display: flex;
  justify-content: space-between;

  & img{
    height: 70px;
    margin: 10px 0 5px 30px;
  }

  & .logo_Btn-filmes{
    display: flex;
    align-items: center;
    gap: 60px;

    & button{
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    
  }

  & .search{
    display: flex;
    align-items: center;

    & input{
      width: 700px;
      height: 40px;
      border-radius: 5px;
      border: none;
      padding: 5px 10px;
      font-size: 16px;
    }
  }

  & .perfil_Btn-login{
    display: flex;
    align-items: center;
    gap: 60px;
    margin: 0 60px 0 0;

    & button{
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
    & button:hover{
      color: rgb(255, 0, 0);
    }
    & .perfil{
      font-size: 30px;
    }
  }
 
}
</style>
