<script setup lang="ts">
import { inject, onMounted, type Ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import EditAccountDialog from './EditAccountDialog.vue'
import LogoutDialog from './LogoutDialog.vue'
import ChangePasswordDialog from './ChangePasswordDialog.vue'

const drawer = inject<Ref<boolean>>('drawer')
const rail = inject<Ref<boolean>>('rail')

const authStore = useAuthStore()
const userStore = useUserStore()

function checkRoleUser(): boolean {
  if (authStore.currentUser?.role.name === 'พนักงาน') {
    return false
  }
  return true
}
function openUserDialog() {
  if (!authStore.currentUser) return
  userStore.editAccount(authStore.currentUser)
}

function openChangePasswordDialog() {
  if (!authStore.currentUser) return
  userStore.openChangePasswordDialog(authStore.currentUser)
}

onMounted(() => {
  authStore.getCurrentUser()
})
</script>
<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    @click="rail = false"
    class="bg-grey-darken-3"
  >
    <v-list-item nav :title="authStore.currentUser?.fullName" class="text-center">
      <template v-slot:prepend>
        <v-menu min-width="200px" rounded>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" size="small" variant="text" @click="rail = false">
              <v-avatar
                :image="`http://localhost:3000/images/users/${authStore.currentUser?.image}`"
              ></v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-card-text class="bg-grey-darken-1">
              <div class="mx-auto text-center">
                <v-avatar
                  :image="`http://localhost:3000/images/users/${authStore.currentUser?.image}`"
                  class="mb-3"
                  style="width: 120px; height: 120px"
                ></v-avatar>
                <h4 style="font-size: 25px; font-weight: bold">
                  {{ authStore.currentUser?.fullName }}
                </h4>
                <p class="mt-1" style="font-size: 18px">{{ authStore.currentUser?.email }}</p>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  rounded="xl"
                  size="x-large"
                  variant="elevated"
                  :disabled="authStore.currentUser ? false : true"
                  @click="openUserDialog()"
                  color="blue-darken-4"
                >
                  แก้ไขบัญชีผู้ใช้
                </v-btn>
                <v-divider class="my-3"></v-divider>
                <v-btn
                  rounded="xl"
                  size="x-large"
                  variant="elevated"
                  :disabled="authStore.currentUser ? false : true"
                  @click="openChangePasswordDialog()"
                  color="red"
                >
                  เปลี่ยนรหัสผ่าน
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </template>
      <template v-slot:append>
        <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="default" nav>
      <v-list-item
        prepend-icon="mdi-coffee"
        title="หน้าขาย"
        value="pos"
        :to="{ name: 'pos' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-receipt-text-check-outline"
        title="ประวัติการขาย"
        value="receipt history"
        :to="{ name: 'receipthistory' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-food"
        title="สินค้า"
        value="product"
        :to="{ name: 'product' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-sale"
        title="โปรโมชั่น"
        value="promotion"
        :to="{ name: 'promotion' }"
      ></v-list-item>
      <v-list-item
        v-if="checkRoleUser()"
        prepend-icon="mdi-account-group"
        title="พนักงาน"
        value="user"
        :to="{ name: 'user' }"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple-plus"
        title="สมาชิก"
        value="member"
        :to="{ name: 'member' }"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
  <edit-account-dialog></edit-account-dialog>
  <logout-dialog></logout-dialog>
  <change-password-dialog></change-password-dialog>
</template>
