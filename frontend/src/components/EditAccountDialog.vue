<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { User } from '@/types/User'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'

const userStore = useUserStore()
const authStore = useAuthStore()
const roleStore = useRoleStore()

const form = ref(false)
const refForm = ref<VForm | null>(null)
const show = ref(false)
const emailRules = [
  (value: string) => {
    if (!value) {
      return 'กรุณากรอกอีเมล'
    } else if (isEmailExist()) {
      return 'อีเมลนี้ถูกใช้ไปแล้ว'
    }
    return true
  }
]

const fullNameRules = [
  (value: string) => {
    if (!value) {
      return 'กรุณากรอกชื่อ'
    } else if (isFullNameExist()) {
      return 'ชื่อถูกใช้ไปแล้ว'
    }
    return true
  }
]

function isEmailExist(): boolean {
  const index = userStore.users.findIndex((item) => item.email === userStore.editedUser.email)
  if (index >= 0 && userStore.editedUser.id === -1) {
    return true
  } else if (checkUserEmail()) {
    return true
  }
  return false
}

function checkUserEmail(): User | undefined {
  const obj: User | undefined = userStore.users.find(
    (item) => item.email === userStore.editedUser.email && item.id !== userStore.editedUser.id
  )
  return obj
}

function isFullNameExist(): boolean {
  const index = userStore.users.findIndex((item) => item.fullName === userStore.editedUser.fullName)
  if (index >= 0 && userStore.editedUser.id === -1) {
    return true
  } else if (checkUserFullName()) {
    return true
  }
  return false
}

function checkUserFullName(): User | undefined {
  const obj: User | undefined = userStore.users.find(
    (item) => item.fullName === userStore.editedUser.fullName && item.id !== userStore.editedUser.id
  )
  return obj
}

function closeDialog() {
  userStore.editAccountDialog = false
  show.value = false
}

async function save() {
  const { valid } = await refForm.value!.validate()

  if (!valid) return
  closeDialog()
  await userStore.saveUser()
}

onMounted(async () => {
  await roleStore.getRoles()
})
</script>
<template>
  <v-dialog persistent width="1024" v-model="userStore.editAccountDialog">
    <v-card max-width="500" class="ma-auto">
      <v-toolbar flat color="#424242">
        <v-toolbar-title style="margin-left: 40px"> โปรไฟล์ผู้ใช้ </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form ref="refForm" v-model="form">
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="mb-2">ชื่อ:</div>
                <v-text-field
                  v-model="userStore.editedUser.fullName"
                  label="ชื่อ"
                  required
                  clearable
                  single-line
                  :rules="fullNameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">อีเมล:</div>
                <v-text-field
                  v-model="userStore.editedUser.email"
                  label="อีเมล"
                  required
                  clearable
                  single-line
                  :rules="emailRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" :sm="authStore.getCurrentUser()?.role.name === 'พนักงาน' ? 12 : 6">
                <div class="mb-2">เพศ:</div>
                <v-select
                  v-model="userStore.editedUser.gender"
                  :items="[
                    { title: 'ชาย', value: 'male' },
                    { title: 'หญิง', value: 'female' },
                    { title: 'อื่นๆ', value: 'others' }
                  ]"
                  label="เพศ"
                  required
                  clearable
                  single-line
                  :rules="[(v: any) => !!v || 'กรุณาเลือกข้อมูล']"
                ></v-select>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="authStore.getCurrentUser()?.role.name === 'พนักงาน' ? false : true"
              >
                <div class="mb-2">ตำแหน่ง:</div>
                <v-select
                  v-model="userStore.editedUser.role"
                  :items="roleStore.roles"
                  item-title="name"
                  item-value="id"
                  label="ตำแหน่ง"
                  clearable
                  single-line
                  :rules="[(v: any) => !!v || 'กรุณาเลือกข้อมูล']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="5">
                <v-img
                  width="150"
                  height="150"
                  cover
                  :src="`http://localhost:3000/images/users/${userStore.editedUser.image}`"
                  class="ma-auto"
                ></v-img>
              </v-col>
              <v-col cols="12" sm="7">
                <v-file-input
                  v-model="userStore.editedUser.files"
                  :rules="[
                    (value: any) => {
                      return (
                        !value ||
                        !value.length ||
                        value[0].size < 2000000 ||
                        'Avatar size should be less than 2 MB!'
                      )
                    }
                  ]"
                  accept="image/png, image/jpeg, image/bmp"
                  label="เลือกรูปภาพ"
                  prepend-icon="mdi-camera"
                ></v-file-input>
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
