<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'

const receiptStore = useReceiptStore()
</script>
<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="6">ยอดก่อนหัก:</v-col>
      <v-col cols="6" class="text-right">{{ receiptStore.receipt?.totalBefore }}</v-col>
      <v-col cols="6">ส่วนลดสมาชิก:</v-col>
      <v-col cols="6" class="text-red text-right"
        >- {{ receiptStore.receipt?.memberDiscount }}</v-col
      >
      <v-col cols="6">ส่วนลดโปรโมชั่น:</v-col>
      <v-col cols="6" class="text-red text-right"
        >- {{ receiptStore.receipt?.promotionDiscount }}</v-col
      >
      <v-col cols="6">ราคารวม:</v-col>
      <v-col cols="6" class="text-right">{{ receiptStore.receipt?.total }}</v-col>
    </v-row>
  </v-container>
</template>
