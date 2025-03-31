<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { inject, ref, type Ref } from 'vue'
import type { VForm } from 'vuetify/components'

const userStore = useUserStore()
const tab = inject<Ref<number>>('tab', ref(1))
const refForm = ref<VForm | null>(null)
const isEmailExist = ref(true)

const emailRules = [
  (v: any) => {
    if (!v) {
      isEmailExist.value = true
      return 'กรุณากรอกอีเมล'
    } else if (!isEmailExist.value) {
      return 'ไม่พบอีเมลของคุณ'
    }
    return true
  }
]

async function toNewPasswordCard() {
  const { valid } = await refForm.value!.validate()
  if (!valid) return
  await userStore.getUserByEmail()
  if (userStore.editedUser.id) {
    isEmailExist.value = true
    tab.value = 2
  } else {
    isEmailExist.value = false
    const { valid } = await refForm.value!.validate()
    isEmailExist.value = true
  }
}

onMounted(() => {
  userStore.clear()
  isEmailExist.value = true
})
</script>
<template>
  <v-form ref="refForm" @submit.prevent="toNewPasswordCard()">
    <v-card
      class="pa-5 ma-auto bg-white d-flex flex-column"
      min-width="380"
      max-width="600"
      height="400"
    >
      <v-card-title class="text-center text-h5 mb-5" style="color: black"
        >กรอกอีเมลของคุณ</v-card-title
      >
      <v-card-text>
        <v-col>
          <v-text-field
            label="Email"
            type="email"
            variant="outlined"
            v-model="userStore.editedUser.email"
            :rules="emailRules"
            style="color: black"
          ></v-text-field>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-col class="text-right">
          <v-btn class="text-black text-right" type="submit">ถัดไป</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
