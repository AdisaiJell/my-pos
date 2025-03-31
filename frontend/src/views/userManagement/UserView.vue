<script setup lang="ts">
import { onMounted, ref } from 'vue'
import UserDialog from './UserDialog.vue'
import { useUserStore } from '@/stores/user'
import type { User } from '@/types/User'
import { useAuthStore } from '@/stores/auth'

const userStore = useUserStore()
const authStore = useAuthStore()
const search = ref('')
let headers = [
  { key: 'id', title: 'ID', value: 'id' },
  { key: 'image', title: 'รูปภาพ' },
  { key: 'fullName', title: 'ชื่อ', value: 'fullName' },
  { key: 'gender', title: 'เพศ', value: 'gender' },
  { key: 'role', title: 'ตำแหน่ง', value: (item: any | User) => item.role.name },
  {
    key: 'branch',
    title: 'สาขา',
    value: (item: any | User) => item.branch.name
  },
  { key: 'actions', title: 'แก้ไข, ลบ', sortable: false }
]

async function openEditUserDialog(item: User) {
  if (item.id) {
    await userStore.getUser(item.id)
  }
  userStore.dialog = true
}

function openDialog() {
  userStore.clear()
  userStore.dialog = true
}

async function openDelDialog(item: User) {
  await userStore.openDelDialog(item)
}

onMounted(async () => {
  if (authStore.currentUser && authStore.currentUser.role.name !== 'เจ้าของร้าน') {
    headers = headers.filter((header) => header.key !== 'branch')
    await userStore.getUsersByUser(authStore.currentUser)
  } else {
    await userStore.getUsers()
  }
})
</script>
<template>
  <v-card flat class="ma-5" elevation="3">
    <v-data-table :headers="headers" :items="userStore.users" :search="search" height="484">
      <template v-slot:top>
        <!-- <v-toolbar flat color="#00337c"> -->
        <v-toolbar flat color="grey-darken-4">
          <v-toolbar-title> ข้อมูลผู้ใช้ </v-toolbar-title>
          <v-row>
            <v-col></v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="search"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="ค้นหาผู้ใช้"
                class="custom-text-field"
                hide-details
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-btn
            rounded="lg"
            variant="flat"
            color="amber"
            size="small"
            icon="mdi-account-group"
            @click="openDialog()"
          ></v-btn>
          <user-dialog></user-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          class="mr-2"
          size="small"
          icon="mdi-pencil"
          @click="openEditUserDialog(item)"
        ></v-icon>
        <v-icon size="small" icon="mdi-delete" @click="openDelDialog(item)"></v-icon>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          :src="`http://localhost:3000/images/users/${item.image}`"
          width="150"
          height="150"
          cover
        >
        </v-img>
      </template>
    </v-data-table>
  </v-card>
</template>
