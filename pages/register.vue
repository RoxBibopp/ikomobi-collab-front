<template>
  <div class="registerCtn">
    <UCard class="cardCtn mx-auto p-6">
      <h2 class="text-center text-2xl font-bold mb-4">Inscription</h2>
      <UForm :state="state" @submit="onSubmit" class="space-y-4">
        <UFormGroup label="Nom" name="name">
          <UInput v-model="state.name" placeholder="Nom" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="Email" />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="Mot de passe (min. 6 caractères)" />
        </UFormGroup>

        <UFormGroup label="Confirmer le mot de passe" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" placeholder="Confirmer le mot de passe" />
        </UFormGroup>

        <UButton type="submit" color="cyan" class="w-full">S'inscrire</UButton>
      </UForm>

      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>

      <div class="text-center mt-2">
        <ULink
          to="/login"
          active-class="text-primary"
          inactive-class="text-primary"
        >
          Déjà un compte ? Connecte-toi
        </ULink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'

interface FormState {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const state = reactive<FormState>({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})


const error = ref<string | null>(null)
const router = useRouter()
const { post } = useApi()

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}


const onSubmit = async (event: Event) => {
  event.preventDefault()

  if (!state.name.trim()) {
    error.value = "Le nom est requis."
    return
  }

  if (!validateEmail(state.email)) {
    error.value = "Email invalide."
    return
  }

  if (state.password.length < 6) {
    error.value = "Le mot de passe doit contenir au moins 6 caractères."
    return
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/
  if (!passwordRegex.test(state.password)) {
    error.value = "Le mot de passe doit contenir au moins une majuscule et un caractère spécial."
    return
  }

  if (state.password !== state.confirmPassword) {
    error.value = "Les mots de passe ne correspondent pas."
    return
  }

  error.value = null

  try {
    const data = await post('/auth/register', { 
      name: state.name, 
      email: state.email, 
      password: state.password 
    })
    localStorage.setItem('token', data.token)
    router.push('/')
  } catch (err: any) {
    error.value = err.data?.message || "Erreur inscription"
  }
}
</script>

<style scoped>
.registerCtn {
  height: 100vh;
  display: flex;
  align-items: center;
}

.cardCtn {
  min-width: 30vw ;
}

@media (max-width: 600px) {
  .max-w-md {
    margin: 1rem;
    padding: 1rem;
  }
}
</style>
