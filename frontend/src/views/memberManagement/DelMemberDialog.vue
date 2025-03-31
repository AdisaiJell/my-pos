<script setup lang="ts">
import { useMemberStore } from '@/stores/member'

const memberStore = useMemberStore()

function closeDialog() {
  memberStore.delDialog = false
  memberStore.clear()
}

async function deleteItem() {
  memberStore.delDialog = false
  await memberStore.deleteMember()
  memberStore.clear()
}
</script>
<template>
  <v-dialog v-model="memberStore.delDialog"  max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden;">
      <v-toolbar flat color="#424242">
          <v-toolbar-title class="text-center" > ลบสมาชิก </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการลบสมาชิกนี้?
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn color="blue" variant="text" size="x-large" @click="closeDialog()">ยกเลิก</v-btn>
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col>
            <v-btn color="red" variant="text" size="x-large" @click="deleteItem()">ลบ</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
