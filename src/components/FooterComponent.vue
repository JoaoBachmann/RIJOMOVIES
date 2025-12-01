<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const mensagem = ref('');

const enviarMensagem = () => {
  if (mensagem.value.trim() !== '') {
    alert('Obrigado por sua mensagem! Iremos analisar suas sugestões.');
    mensagem.value = '';
  } else {
    alert('Por favor, insira uma mensagem antes de enviar.');
  }
};
</script>

<template>
  <Footer>
   
    <div class="infoFooter">
      <div class="newsletter">
        <h2>Compartilhe sua experiencia no site</h2>
        <input type="text" placeholder="Encontrou algo que poderia melhorar? Conte pra gente!" v-model="mensagem"/>
        <button @click="enviarMensagem">Enviar</button>
      </div>
      <div class="redesSociais">
        <div class="icones">
          <a href=""><span class="mdi mdi-instagram"></span></a>
          <a href=""><span class="mdi mdi-facebook"></span></a>
          <a href=""><span class="mdi mdi-youtube"></span></a>
        </div>
        <p>© 2024 <RouterLink to="/"><span>RijoMovies</span></RouterLink>. Todos os direitos reservados.</p>
      </div>

      <img src="/public/claquete.png" alt="">
    </div>
  </Footer>
</template>
<style lang="scss" scoped>
footer {
  background-color: black;
  
  & .imagemFita {
    display: flex;
    & .fita1 {
      background-image: url('/public/fita.png');
      filter: brightness(0) invert(1);
      color: white;
      background-size: cover;
      background-position: center;
      width: 25%;
      height: 200px;
    }
  }

  & .infoFooter {
    text-align: center;
    position: relative;
    overflow: hidden;
    padding-bottom: 5vw;

    & .newsletter {
      & h2 {
        color: white;
        font-size: 47px;
      }
      & input {
        width: 30%;
        height: 60px;
        font-size: 16px;
        padding: 0 6.5vw 0 15px;
        margin-top: 20px;
        background-color: transparent;
        color: white;
        border: 1px solid rgb(43, 42, 42);
        outline: none;
        margin: 2vw 0 0 6vw;
      }
      & button {
        height: 47px;
        font-size: 15px;
        padding: 5px 25px;
        margin-left: 10px;
        cursor: pointer;
        position: relative;
        right: 110px;
        background-color: rgba(245, 179, 83, 1);
        border: none;
        transition: background-color 0.3s;
      }
      & button:hover {
        background-color: rgba(245, 179, 83, 1);
        animation: pulse 1.5s infinite;
        
      }
      @keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 179, 83, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 10px 10px rgba(245, 179, 83, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(245, 179, 83, 0);
  }
}
    }
    & .redesSociais {
      margin-top: 50px;
      & .icones {
        display: flex;
        justify-content: center;
        gap: 30px;
        & a {
          color: rgba(245, 179, 83, 1);
          font-size: 20px;
          border: solid 2px rgb(43, 42, 42);
          border-radius: 50%;
          padding: 10px 15px;
        }
        & a:hover {
          background-color: rgba(245, 179, 83, 1);
          transition: all 0.3s;
          color: black;
        }
      }

      & p {
        color: white;
        margin-top: 40px;
        & a {
          color: rgba(245, 179, 83, 1);
          text-decoration: none;
        }
      }
    }
    & img {
      position: absolute;
      width: 700px;
      top: 7vh;
      right: -160px;
    }
  }

}
</style>
