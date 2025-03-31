<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { inject } from 'vue'
import { useLoadingStore } from '@/stores/loading'
import router from '@/router'
import { onMounted } from 'vue'
import type { VForm } from 'vuetify/components'

const userStore = useUserStore()
const tab = inject<Ref<number>>('tab', ref(2))
const show = ref(false)
const refForm = ref<VForm | null>(null)
const loadingStore = useLoadingStore()

function backToEmailCard() {
  const email = userStore.editedUser.email
  loadingStore.doLoad()
  setTimeout(() => {
    setTimeout(() => {
      userStore.clear()
      userStore.editedUser.email = email
      show.value = false
    }, 0.1 * 1000)
    tab.value = 1
    loadingStore.finishLoad()
  }, 0.3 * 1000)
}

async function saveNewPassword() {
  const { valid } = await refForm.value!.validate()
  if (!valid) return
  await userStore.saveUser()
  router.replace({ name: 'login' })
  setTimeout(() => {
    userStore.clear()
  }, 0.1 * 1000)
}
onMounted(() => {
  show.value = false
})
</script>
<template>
  <v-form ref="refForm" @submit.prevent="saveNewPassword()">
    <v-card
      class="pa-5 ma-auto bg-white d-flex flex-column"
      min-width="380"
      max-width="600"
      height="400"
    >
      <v-card-title class="text-center text-h5 mb-5" style="color: black"
        >กรอกรหัสผ่านใหม่</v-card-title
      >
      <v-card-text>
        <v-col class="text-center">
          <v-chip>
            <v-avatar start>
              <v-img
                :src="`http://localhost:3000/images/users/${userStore.editedUser.image}`"
                cover
              ></v-img>
            </v-avatar>
            {{ userStore.editedUser.email }}
          </v-chip>
        </v-col>
        <v-col>
          <v-text-field
            label="Password"
            variant="outlined"
            :type="show ? 'text' : 'password'"
            v-model="userStore.editedUser.password"
            :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่าน']"
            style="color: black"
          >
            <template v-slot:append-inner>
              <v-icon :icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click="show = !show"></v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-col class="text-left">
          <v-btn class="text-black text-right" @click="backToEmailCard()">ย้อนกลับ</v-btn>
        </v-col>
        <v-col class="text-right">
          <v-btn class="text-black text-right" type="submit">บันทึก</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
