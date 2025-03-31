<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'

const receiptStore = useReceiptStore()
function calcelReceipt() {
  receiptStore.clear()
  receiptStore.cancelReceiptDialog = false
}
</script>
<template>
  <v-dialog v-model="receiptStore.cancelReceiptDialog"  max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden;">
      <v-toolbar flat color="#424242">
          <v-toolbar-title class="text-center" > ยกเลิก </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการยกเลิก?
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn color="blue" variant="text" size="x-large" @click="receiptStore.cancelReceiptDialog = false">ยกเลิก</v-btn>
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col>
            <v-btn color="red" variant="text" size="x-large" @click="calcelReceipt()">ตกลง</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
