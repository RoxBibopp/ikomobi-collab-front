<template>
  <div class="groupDetailCtn">
    <UCard class="cardCtn mx-auto p-6">
      <h1 class="text-center text-3xl font-bold mb-4">{{ groupData.group.name }}</h1>
      <p v-if="groupData.group.description" class="text-center mb-4">
        {{ groupData.group.description }}
      </p>
      
      <h2 class="text-xl font-bold mb-2">Membres</h2>
      <div v-if="loading" class="text-center">Chargement…</div>
      <ul v-else class="space-y-2">
        <li v-if="groupData.members.length === 0" class="text-center text-gray-500">
          Aucun membre
        </li>
        <li 
          v-for="member in groupData.members" 
          :key="member.id" 
          class="p-2 border rounded flex items-center justify-between"
        >
          <span>{{ member.User.name }} - {{ member.User.email }}</span>
          <div>
            <template v-if="member.status === 'pending'">
              <span class="text-gray-500 text-sm mr-2">Invitation envoyée</span>
              <UButton 
                v-if="currentUserId === groupData.group.creatorId.toString()"
                size="sm" 
                color="red" 
                @click="cancelInvitation(member.id)">
                Annuler invitation
              </UButton>
            </template>
            <template v-else>
              <UButton
                v-if="currentUserId === groupData.group.creatorId.toString() && member.User.email !== currentUserEmail"
                size="sm" 
                color="red" 
                @click="removeMember(member.id)">
                Supprimer
              </UButton>
            </template>
          </div>
        </li>
      </ul>

      <div v-if="currentUserId === groupData.group.creatorId.toString()" class="mt-4">
        <h3 class="text-xl font-bold mb-2">Inviter un membre</h3>
        <form @submit.prevent="inviteMember" class="flex space-x-2">
          <UInput
            v-model="inviteEmail"
            type="email"
            placeholder="Email du membre"
            class="flex-1"
          />
          <UButton type="submit" color="cyan">Inviter</UButton>
        </form>
        <p v-if="inviteError" class="text-red-500 mt-2">{{ inviteError }}</p>
      </div>

      <div class="text-center mt-4">
        <NuxtLink to="/">
          <UButton variant="ghost">Retour</UButton>
        </NuxtLink>
      </div>

    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useApi } from '~/composables/useApi'

interface Group { 
  group: { 
    id: number, 
    name: string, 
    description: string,
    createdAt: string, 
    updatedAt: string, 
    creatorId: number 
  },
  members: Array<Member>
}  

interface Member {
  id: number,
  status: string,
  User: {
    name: string,
    email: string
  }
}

const groupData = ref<Group>({
  group: {
    id: 0,
    name: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    creatorId: 0
  },
  members: []
})
const loading = ref<boolean>(false)
const route = useRoute()
const { get, post, remove, put } = useApi();
const currentUserId = ref<string>('');
const currentUserEmail = ref<string>('');
if (import.meta.client) {
  currentUserId.value = localStorage.getItem('userId') || '';
  currentUserEmail.value = localStorage.getItem('userEmail') || '';
}
const fetchGroupDetails = async () => {
  loading.value = true
  try {
    const groupId = route.params.id
    const data = await get(`/groups/${groupId}`)
    groupData.value = data
  } catch (error) {
    console.error("Erreur détails du groupe", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchGroupDetails()
})

const removeMember = async(memberId: number) => {
  try {
    await remove('/members/remove', { groupId: groupData.value.group.id, userId: memberId })
    await fetchGroupDetails()
  } catch (error) {
    console.error("Erreur suppression du membre", error)
  }
}

const cancelInvitation = async(invitationId: number) => {
  try {
    await put(`/members/invitations/cancel/${invitationId}`, {});
    await fetchGroupDetails();
  } catch (error) {
    console.error("Erreur annulation de l'invitation", error);
  }
}

const inviteEmail = ref<string>('')
const inviteError = ref<string | null>(null)

const inviteMember = async() => {
  inviteError.value = null
  if (!inviteEmail.value.trim()) {
    inviteError.value = "email requis."
    return
  }
  try {
    await post('/members/invite', { groupId: groupData.value.group.id, email: inviteEmail.value })
    inviteEmail.value = ''
    await fetchGroupDetails()
  } catch (error: any) {
    inviteError.value = error.data?.message || "Erreur"
  }
}
</script>

<style scoped>
.groupDetailCtn {
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
