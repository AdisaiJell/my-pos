<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Member } from '@/types/Member'
import { useMemberStore } from '@/stores/member'
import MemberDialog from './MemberDialog.vue'
import DelMemberDialog from './DelMemberDialog.vue'

const memberStore = useMemberStore()

const search = ref('')
const headers = [
  { key: 'id', title: 'ID', value: 'id' },
  { key: 'name', title: 'ชื่อ', value: 'name' },
  { key: 'tel', title: 'เบอร์โทรศัพท์', value: 'tel' },
  { key: 'point', title: 'แต้ม', value: 'point' },
  { key: 'actions', title: 'แก้ไข, ลบ', sortable: false }
]

function openDialog() {
  memberStore.clear()
  memberStore.openDialog = true
}

async function editMember(item: Member) {
  if (item.id) {
    await memberStore.getMember(item.id)
  }
  memberStore.openDialog = true
}

async function openDelDialog(item: Member) {
  if (item.id) {
    await memberStore.getMember(item.id)
  }
  memberStore.delDialog = true
}

onMounted(async () => {
  await memberStore.getMembers()
})
</script>
<template>
  <v-card flat class="ma-5" elevation="3">
    <v-data-table :headers="headers" :items="memberStore.members" :search="search" height="484">
      <template v-slot:top>
        <!-- <v-toolbar flat color="#00337c"> -->
        <v-toolbar flat color="grey-darken-4">
          <v-toolbar-title> สมาชิก </v-toolbar-title>
          <v-row>
            <v-col></v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="search"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="ค้นหาผู้ใช้และเบอร์ผู้ใช้"
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
            icon="mdi-account-multiple-plus"
            @click="openDialog()"
          ></v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" size="small" icon="mdi-pencil" @click="editMember(item)"></v-icon>
        <v-icon size="small" icon="mdi-delete" @click="openDelDialog(item)"></v-icon>
      </template>
    </v-data-table>
  </v-card>
  <member-dialog></member-dialog>
  <del-member-dialog></del-member-dialog>
</template>
