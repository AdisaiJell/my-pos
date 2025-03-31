<script setup lang="ts">
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()
const form = ref(false)
const refForm = ref<VForm | null>(null)
const show1 = ref(false)
const show2 = ref(false)
const isOldPassCorrect = ref(true)

const checkPassword = (v: any) => {
  if (!v) {
    return 'กรุณากรอกรหัสผ่านเก่า'
  } else if (!isOldPassCorrect.value) {
    return 'รหัสผ่านเก่าไม่ถูกต้อง'
  }
  return true
}

function closeDialog() {
  userStore.changePasswordDialog = false
  show1.value = false
  show2.value = false
  userStore.oldPass = ''
}

async function save() {
  const { valid } = await refForm.value!.validate()

  if (!valid) return
  const user = await userStore.changePassword()
  if (!user.data) {
    isOldPassCorrect.value = false
    await refForm.value!.validate()
    isOldPassCorrect.value = true
  } else {
    closeDialog()
    authStore.logout()
    userStore.clear()
  }
}

onMounted(() => {
  isOldPassCorrect.value = true
})
</script>
<template>
  <v-dialog persistent width="1024" v-model="userStore.changePasswordDialog">
    <v-card width="500" class="ma-auto" style="overflow-y: hidden">
      <v-toolbar flat color="#424242">
        <v-toolbar-title style="margin-left: 40px"> เปลี่ยนรหัสผ่าน </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="refForm" v-model="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="mb-2">รหัสผ่านเก่า:</div>
                <v-text-field
                  v-model="userStore.oldPass"
                  label="รหัสผ่านเก่า"
                  :type="show1 ? 'text' : 'password'"
                  required
                  clearable
                  single-line
                  :rules="[checkPassword]"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show1 = !show1"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">รหัสผ่านใหม่:</div>
                <v-text-field
                  v-model="userStore.editedUser.password"
                  label="รหัสผ่านใหม่"
                  :type="show2 ? 'text' : 'password'"
                  required
                  clearable
                  single-line
                  :rules="[(v) => !!v || 'กรุณากรอกรหัสผ่านใหม่']"
                  :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show2 = !show2"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col cols="12" sm="4">
            <v-btn variant="text" block @click="closeDialog()"> ยกเลิก </v-btn>
          </v-col>
          <v-col cols="12" sm="8">
            <v-btn color="blue" variant="flat" block @click="save()"> บันทึก </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
