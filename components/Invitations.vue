<template>
  <div class="invitations">
    <h2 class="text-2xl font-bold mb-4">Mes Invitations</h2>
    <div v-if="loading" class="text-center">Chargement…</div>
    <div v-else>
      <div v-if="invitations.length === 0" class="text-center text-gray-500">
        Vous n'avez aucune invitation.
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="inv in invitations"
          :key="inv.id"
          class="p-2 border rounded flex flex-col gap-2"
        >
          <div>
            <strong>{{ inv.Group.name }}</strong>
            <p class="text-sm text-gray-600">{{ inv.Group.description }}</p>
          </div>
          <div class="flex gap-2">
            <UButton size="sm" color="green" @click="respondInvitation(inv.Group.id, 'accepted')">
              Accepter
            </UButton>
            <UButton size="sm" color="red" @click="respondInvitation(inv.Group.id, 'refused')">
              Refuser
            </UButton>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApi } from '~/composables/useApi'

interface Group {
  id: number;
  name: string;
  description: string;
}

interface Invitation {
  id: number;
  status: string;
  groupId: number;
  Group: Group;
}

const invitations = ref<Invitation[]>([])
const loading = ref<boolean>(false)
const { get, post } = useApi()
const emit = defineEmits<{ (e: 'refreshGroups'): void }>()
const fetchInvitations = async () => {
  loading.value = true
  try {
    const data = await get('/members/invitations/pending')
    invitations.value = data
  } catch (err) {
    console.error("Erreur récupération des invitations", err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInvitations()
})
const respondInvitation = async (groupId: number, response: 'accepted' | 'refused') => {
  try {
    await post('/members/invitations/respond', { groupId, response })
    await fetchInvitations() 
    if (response === 'accepted') {
      emit('refreshGroups')
    }
  } catch (err) {
    console.error("Erreur réponse à l'invitation", err)
  }
}
</script>

<style scoped>
.invitations {
  margin-top: 2rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
</style>
