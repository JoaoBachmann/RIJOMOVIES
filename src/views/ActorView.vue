<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const ator = ref(null)

onMounted(async () =>  {
    const id = route.params.id 
    const {data} = await api.get(`person/${id}`, 
    {
        params: {append_to_response: 'name,birthday,biography,place_of_birth,profile_path'}
    })
    ator.value = data
})
</script>
<template>
    <div v-if="ator" class="actor-view">
        <img class="profile" :src="`https://image.tmdb.org/t/p/original${ator.profile_path}`" :alt="ator.name" />

        <div class="information">
            <h1>{{ ator.name }}</h1>
            <p><strong>Birthday:</strong> {{ ator.birthday }}</p>
            <p><strong>Place of Birth:</strong> {{ ator.place_of_birth }}</p>
            <p class="bio"><strong>Biography:</strong></p>
            <p class="bio-text">{{ ator.biography }}</p>
        </div>
    </div>
</template>