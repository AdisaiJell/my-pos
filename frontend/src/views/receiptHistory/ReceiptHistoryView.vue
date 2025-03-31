<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'
import type { Receipt } from '@/types/Receipt'
import { onMounted, ref } from 'vue'
import ReceiptHistoryDialog from './ReceiptHistoryDialog.vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/User'

const receiptStore = useReceiptStore()
const authStore = useAuthStore()
const startDate = ref(formatDate(new Date()))
const endDate = ref(formatDate(new Date()))

const search = ref('')
let headers = [
  { key: 'id', title: 'ID', value: 'id' },
  { key: 'total', title: 'รวม', value: 'total' },
  { key: 'qty', title: 'ปริมาณ', value: 'qty' },
  { key: 'memberDiscount', title: 'ส่วนลดสมาชิก', value: 'memberDiscount' },
  { key: 'promotionDiscount', title: 'ส่วนลดโปรโมชั่น', value: 'promotionDiscount' },
  {
    key: 'created',
    title: 'วันที่ออกใบเสร็จ',
    value: (item: any | Receipt) => new Date(item.created).toLocaleString()
  },
  { key: 'user', title: 'ผู้ใช้', value: (item: any | User) => item.user.fullName },
  { key: 'branch', title: 'สาขา', value: (item: any | User) => item.branch.name },
  { key: 'paymentType', title: 'การชำระเงิน', value: 'paymentType' },
  { key: 'actions', title: 'แก้ไข, ลบ', sortable: false }
]

async function openDialog(item: Receipt) {
  receiptStore.clear()
  await receiptStore.getReceipt(item)
  receiptStore.openDialog = true
}

function formatDate(date: Date): string {
  const newDateFormat = [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, '0'),
    date.getDate().toString().padStart(2, '0')
  ].join('-')
  return newDateFormat
}

async function findReceipt() {
  if (authStore.currentUser) {
    await receiptStore.getReceiptsWithDate(startDate.value, endDate.value, authStore.currentUser)
  }
}

onMounted(async () => {
  if (authStore.currentUser?.role.name === 'พนักงาน') {
    headers = headers.filter((header) => header.key !== 'branch')
    await receiptStore.getReceiptsByUser(authStore.currentUser)
  } else {
    await receiptStore.getReceipts()
  }
})
</script>
<template>
  <v-card flat class="ma-5" elevation="3" color="grey-darken-4">
    <v-data-table :headers="headers" :items="receiptStore.receipts" :search="search" height="484">
      <template v-slot:top>
        <v-toolbar flat color="grey-darken-4">
          <v-toolbar-title> ประวัติการขาย </v-toolbar-title>
          <v-row>
            <v-col></v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="search"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="ค้นหารายชื่อ"
                class="custom-text-field"
                hide-details
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col cols="12" sm="2" class="select-column">
            <v-text-field
              type="date"
              density="compact"
              label="วันเริ่มต้น"
              v-model="startDate"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2" class="select-column">
            <v-text-field
              type="date"
              density="compact"
              label="วันสิ้นสุด"
              v-model="endDate"
            ></v-text-field>
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-btn rounded="lg" variant="flat" color="amber" @click="findReceipt()">ค้นหา</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" size="small" icon="mdi-magnify" @click="openDialog(item)"></v-icon>
      </template>
    </v-data-table>
    <receipt-history-dialog></receipt-history-dialog>
  </v-card>
</template>
<style>
.select-column {
  margin-top: 22px; /* ปรับขึ้นลงตามที่ต้องการ */
}
</style>
