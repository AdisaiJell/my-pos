<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import { useLoadingStore } from '@/stores/loading'

const authStore = useAuthStore()
const loadingStore = useLoadingStore()
const show = ref(false)
const refForm = ref<VForm | null>(null)
const isClickedLogin = ref(false)

const loginRules = (v: string): any => {
  if (!v) {
    isClickedLogin.value = false
    return 'กรุณากรอกข้อมูล'
  } else if (!authStore.getCurrentUser() && isClickedLogin.value) {
    return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
  }
  return true
}

function toForgotPasswordView() {
  loadingStore.doLoad()
  setTimeout(() => {
    router.push({ name: 'forgot-password' })
    loadingStore.finishLoad()
  }, 0.3 * 1000)
}

async function onSubmit() {
  await authStore.login()
  if (authStore.email && authStore.password) {
    isClickedLogin.value = true
  }
  const { valid } = await refForm.value!.validate()
}

onMounted(() => {
  localStorage.removeItem('user')
  localStorage.removeItem('access_token')
  isClickedLogin.value = false
})
</script>
<template>
  <div
    style="position: absolute; top: 50%; left: 70%; transform: translate(-50%, -50%); opacity: 0.8"
  >
    <v-form ref="refForm" @submit.prevent="onSubmit()">
      <v-card
        class="pa-5 ma-auto"
        min-width="380"
        max-width="600"
        height="550"
        rounded="xl"
        elevation="0"
        style="border: none; background: none"
      >
        <v-img
          src="./img/GoodluckLogo.png"
          alt="Logo"
          width="160"
          height="160"
          style="margin: 0 auto"
        ></v-img>
        <v-card-title class="text-center text-h5 mb-5 font-bold" style="color: white"
          >ลงชื่อเข้าสู่ระบบ</v-card-title
        >

        <v-card-text>
          <v-text-field
            label="อีเมล"
            type="email"
            v-model="authStore.email"
            :rules="[loginRules]"
            class="mb-3"
            style="color: white"
          ></v-text-field>

          <v-text-field
            label="รหัสผ่าน"
            :type="show ? 'text' : 'password'"
            v-model="authStore.password"
            :rules="[loginRules]"
            style="color: white"
          >
            <template v-slot:append-inner>
              <v-icon :icon="show ? 'mdi-eye' : 'mdi-eye-off'" @click="show = !show"></v-icon>
            </template>
          </v-text-field>

          <v-btn block class="bg-amber mt-5" type="submit">เข้าสู่ระบบ</v-btn>
        </v-card-text>
        <v-card-actions>
          <v-col>
            <v-row> </v-row>
          </v-col>
          <v-btn class="text-white text-caption" @click="toForgotPasswordView()"
            >ลืมรหัสผ่านหรือไม่</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </div>
</template>
