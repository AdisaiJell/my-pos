<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
function logout() {
  authStore.logout()
}

function closeDialog() {
  authStore.closeLogoutDialog()
}
</script>
<template>
  <v-dialog persistent v-model="authStore.logoutDialog" max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden">
      <v-toolbar flat color="#424242">
        <v-toolbar-title class="text-center"> ออกจากระบบ </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?
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
            <v-btn color="red" variant="text" size="x-large" @click="logout()">ออกจากระบบ</v-btn>
          </v-col>
        </v-row>

        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
