<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'
const receiptStore = useReceiptStore()
</script>
<template>
  <v-snackbar v-model="receiptStore.promotionSnackbar" vertical width="500">
    โปรโมชั่น {{ receiptStore.promotionForSnackBar?.name }}
    <span
      v-text="
        receiptStore.promotionForSnackBar?.promotionType?.name === '1แถม1'
          ? 'สามารถเลือกสิ้นค้าที่ร่วมรายการได้ฟรี 1 รายการ'
          : `ลดราคา ${receiptStore.promotionForSnackBar?.discount! * 100}%`
      "
    ></span>

    <template v-slot:actions>
      <v-btn color="pink" variant="text" @click="receiptStore.promotionSnackbar = false">
        ปิด
      </v-btn>
    </template>
  </v-snackbar>
</template>
