<script setup></script>
<template>
  <Footer>
    <div class="imagemFita">
      <div class="fita1"></div>
      <div class="fita1"></div>
      <div class="fita1"></div>
      <div class="fita1"></div>
    </div>
    <div class="infoFooter">
        <div class="newsletter">
            <h2>Compartilhe sua experiencia no site</h2>
            <input type="text" placeholder="Encontrou algo que poderia melhorar? Conte pra gente!" />
            <button>Enviar</button>
        </div>
        <div class="redesSociais">
            <div class="icones">
                <a href="#"><img src="/public/Instagram_icon.png" alt="Instagram"></a>
                <a href="#"><img src="/public/facebook.png" alt="Facebook"></a>
                <a href="#"><img src="/public/youtube.png" alt=""></a>
                
            </div>
            <p>© 2024 RijoMovies. Todos os direitos reservados.</p>
        </div>
    </div>
  </Footer>
</template>
<style lang="scss" scoped>
footer {
  background-color: black;
  margin: 0;
  padding: 0;
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
    & .newsletter{
        & h2{
            color: white;
            font-size: 40px;
        }
        & input{
            width: 40%;
            height: 40px;
            font-size: 20px;
            padding: 5px;
            margin-top: 20px;
        }
    }
  }
}
</style>
