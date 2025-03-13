<template>
  <div class="dashboardCtn">
    <UCard class="cardCtn mx-auto p-6">
      <h1 class="text-center text-3xl font-bold mb-4">Mes Groupes</h1>
      <div v-if="loading" class="text-center">Chargement…</div>
      <div v-else>
        <div v-if="groups.length === 0" class="text-center text-gray-500">
          Aucun groupe
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="group in groups"
            :key="group.id"
            class="p-2 border rounded hover:bg-gray-100"
          >
            <NuxtLink :to="`/group/${group.id}`">{{ group.name }}</NuxtLink>
            <UButton
              v-if="currentUserId == group.creatorId.toString()"
              size="sm"
              color="red"
              @click="deleteGroup(group.id)"
              class="ml-2"
            >
              Supprimer
            </UButton>
          </li>
        </ul>
      </div>
      <div class="text-center mt-4">
        <NuxtLink to="/create-group">
          <UButton color="cyan">Créer un groupe</UButton>
        </NuxtLink>
      </div>
      <div class="text-center mt-4">
        <UButton variant="ghost" @click="logout">
          Déconnexion
        </UButton>
      </div>
      <Invitations @refreshGroups="fetchGroups" />
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useApi } from '~/composables/useApi'

interface Group {
  id: number
  name: string
  description: string
  creatorId: number
}

const groups = ref<Group[]>([])
const loading = ref<boolean>(false)
const { get, remove } = useApi()

const currentUserId = ref<string>('')
if (import.meta.client) {
  currentUserId.value = localStorage.getItem('userId') || ''
}

const fetchGroups = async () => {
  loading.value = true
  try {
    const data = await get('/groups')
    groups.value = data
  } catch (err) {
    console.error('Erreur récupération groupes', err)
  } finally {
    loading.value = false
  }
}

const deleteGroup = async (groupId: number) => {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce groupe ?")) return
  try {
    await remove(`/groups/${groupId}`, {}); 
    await fetchGroups();
  } catch (err) {
    console.error("Erreur suppression groupe", err)
  }
}

const logout = () => {
  if (import.meta.client) {
    localStorage.removeItem('token')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
  }
  const tokenCookie = useCookie('token')
  tokenCookie.value = null
  navigateTo('/login');
}

onMounted(() => {
  fetchGroups()
})
</script>

<style scoped>
.dashboardCtn {
  padding: 1rem;
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
