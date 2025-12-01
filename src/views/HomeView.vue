<script setup>
import CarrosselComponent from '@/components/CarrosselComponent.vue'
import LancamentosComponent from '@/components/LancamentosComponent.vue'
import TendenciasComponent from '@/components/TendenciasComponent.vue'
import MaiorBiComponent from '@/components/MaiorBiComponent.vue'
import AtoresComponent from '@/components/AtoresComponent.vue'
</script>

<template>
  <header></header>

  <main>
    <carrossel-component />
    <lancamentos-component />
    <tendencias-component />
    <maior-bi-component />
    <atores-component />
  </main>

  <footer></footer>
</template>
