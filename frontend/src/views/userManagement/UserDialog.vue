<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import type { User } from '@/types/User'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'
import { useBranchStore } from '@/stores/branch'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const roleStore = useRoleStore()
const branchStore = useBranchStore()
const authStore = useAuthStore()
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

const salaryRules = [
  (value: any) => {
    if (!value) {
      return 'กรุณากรอกเเงินเดือน'
    } else if (value < 0) {
      return 'เงินเดือนต่ำกว่า 0'
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
  userStore.dialog = false
  show.value = false
}

async function confirmDelDialog() {
  userStore.dialogDelete = false
  await userStore.deleteUser()
  userStore.clear()
}

function closeDelDialog() {
  userStore.dialogDelete = false
  userStore.clear()
}

async function save() {
  const { valid } = await refForm.value!.validate()

  if (!valid) return
  closeDialog()
  await userStore.saveUser()
}

onMounted(async () => {
  await roleStore.getRoles()
  await branchStore.getBranches()
})
</script>
<template>
  <v-dialog persistent width="1024" v-model="userStore.dialog">
    <v-card max-width="500" class="ma-auto">
      <v-toolbar flat color="#424242">
        <v-toolbar-title style="margin-left: 40px"> ข้อมูลผู้ใช้ </v-toolbar-title>
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
              <v-col cols="12" v-if="userStore.editedUser.id ? false : true">
                <div class="mb-2">รหัสผ่าน:</div>
                <v-text-field
                  v-model="userStore.editedUser.password"
                  label="รหัสผ่าน"
                  :type="show ? 'text' : 'password'"
                  required
                  clearable
                  single-line
                  :rules="[(v: any) => !!v || 'กรุณากรอกรหัสผ่าน']"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="show = !show"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="mb-2">เพศ:</div>
                <v-select
                  single-line
                  label="เพศ"
                  v-model="userStore.editedUser.gender"
                  :items="[
                    { title: 'ชาย', value: 'ชาย' },
                    { title: 'หญิง', value: 'หญิง' },
                    { title: 'อื่นๆ', value: 'อื่นๆ' }
                  ]"
                  required
                  clearable
                  :rules="[(v: any) => !!v || 'กรุณาเลือกข้อมูล']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="mb-2">ตำแหน่ง:</div>
                <v-select
                  single-line
                  label="ตำเเหน่ง"
                  v-model="userStore.editedUser.role"
                  :items="roleStore.roles"
                  :item-title="
                    (item: any) =>
                      item.name.substring(0, 1).toUpperCase() + item.name.substring(1).toLowerCase()
                  "
                  item-value="id"
                  :return-object="true"
                  clearable
                  :rules="[(v: any) => !!v || 'กรุณาเลือกข้อมูล']"
                ></v-select>
              </v-col>
              <v-col cols="12" v-if="authStore.currentUser?.role.name === 'เจ้าของร้าน'">
                <div class="mb-2">เงินเดือน:</div>
                <v-text-field
                  type="number"
                  min="0"
                  v-model="userStore.editedUser.salaryRate"
                  clearable
                  :rules="salaryRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="authStore.currentUser?.role.name === 'เจ้าของร้าน'">
                <div class="mb-2">สาขา:</div>
                <v-select
                  v-model="userStore.editedUser.branch"
                  :items="branchStore.branches"
                  :item-title="
                    (item: any) =>
                      item.name.substring(0, 1).toUpperCase() + item.name.substring(1).toLowerCase()
                  "
                  label="สาขา"
                  item-value="id"
                  :return-object="true"
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
                  accept="image/png, image/jpeg"
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
  <!-- Delete dialog -->
  <v-dialog v-model="userStore.dialogDelete" max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden">
      <v-toolbar flat color="#424242">
        <v-toolbar-title class="text-center"> ลบข้อมูลผู้ใช้ </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ใช้นี้?
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn color="blue" variant="text" size="x-large" @click="closeDelDialog()"
              >ยกเลิก</v-btn
            >
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col>
            <v-btn color="red" variant="text" size="x-large" @click="confirmDelDialog()">ลบ</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
