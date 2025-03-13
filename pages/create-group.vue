<template>
  <div class="createGroupCtn">
    <UCard class="cardCtn mx-auto p-6">
      <h1 class="text-center text-3xl font-bold mb-4">Créer un groupe</h1>
      <UForm :state="state" @submit="createGroup" class="space-y-4">
        <UFormGroup label="Nom du groupe" name="name">
          <UInput v-model="state.name" placeholder="Nom du groupe" />
        </UFormGroup>
        <UFormGroup label="Description" name="description">
          <UInput v-model="state.description" placeholder="Description du groupe" />
        </UFormGroup>
        <UButton type="submit" color="cyan" class="w-full">Créer</UButton>
      </UForm>
      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
      <div class="text-center mt-2">
        <NuxtLink to="/">
          <UButton variant="ghost">Retour</UButton>
        </NuxtLink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

interface GroupFormState {
  name: string
  description: string
}

const state = reactive<GroupFormState>({
  name: '',
  description: ''
})

const error = ref<string | null>(null)
const router = useRouter()
const { post } = useApi()

const createGroup = async(event: Event) => {
  event.preventDefault()
  if (!state.name.trim()) {
    error.value = "nom du groupe requis."
    return
  }
  try {
    await post('/groups', {
      name: state.name,
      description: state.description
    })
    router.push('/')
  } catch (err: any) {
    error.value = err.data?.message || "Erreur création  groupe"
  }
}
</script>

<style scoped>
.createGroupCtn {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}

.cardCtn {
  max-width: 600px;
}

@media (max-width: 600px) {
  .cardCtn {
    width: 90%;
    padding: 1rem;
  }
}
</style>
