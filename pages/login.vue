<template>
  <div class="loginCtn">
    <UCard class="cardCtn mx-auto p-6">
      <h2 class="text-center text-2xl font-bold mb-4">Connexion</h2>
      <UForm :state="state" @submit="handleLogin" class="space-y-4">
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" type="email" placeholder="Email" />
        </UFormGroup>
        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" placeholder="Mot de passe" />
        </UFormGroup>
        <UButton type="submit" color="cyan" class="w-full">Se connecter</UButton>
      </UForm>
      <p v-if="error" class="text-red-500 text-center mt-4">{{ error }}</p>
      <div class="text-center mt-2">
        <ULink to="/register" active-class="text-primary" inactive-class="text-primary">
          Créer un compte
        </ULink>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '~/composables/useApi'
import { jwtDecode } from "jwt-decode";
interface FormState {
  email: string;
  password: string;
}

interface JwtPayload {
  id: string;
}

const state = reactive<FormState>({
  email: '',
  password: ''
})

const error = ref<string | null>(null)
const router = useRouter()
const { post } = useApi()
const tokenCookie = useCookie<string>('token')

const handleLogin = async(event: Event) => {
  event.preventDefault();
  try {
    const data = await post('/auth/login', {
      email: state.email,
      password: state.password
    })
    localStorage.setItem('token', data.token);
    localStorage.setItem('userEmail', state.email);
    tokenCookie.value = data.token;
    const decoded = jwtDecode<JwtPayload>(data.token);
    localStorage.setItem('userId', decoded.id);
    router.push('/')
  } catch (err: any) {
    error.value = err.data?.message || "Erreur connexion"
  }
}
</script>

<style scoped>
.loginCtn {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-sizing: border-box;
}

.cardCtn {
  min-width: 30vw;
}

@media (max-width: 600px) {
  .cardCtn {
    width: 90%;
    padding: 1rem;
  }
}
</style>
