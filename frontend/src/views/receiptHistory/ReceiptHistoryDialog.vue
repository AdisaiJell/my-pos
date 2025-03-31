<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

const receiptStore = useReceiptStore()

const refForm = ref<VForm | null>(null)
</script>
<template>
  <v-dialog v-model="receiptStore.openDialog" max-width="700">
    <v-form ref="refForm">
      <v-card height="600">
        <v-toolbar flat color="#424242">
          <v-toolbar-title> รายละเอียดใบเสร็จ </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col class="text-left"
                >ผู้ขาย: {{ receiptStore.editedReceipt.user?.fullName }}</v-col
              >

              <v-col class="text-right"
                >วันที่-เวลา:
                {{ new Date(receiptStore.editedReceipt.created).toLocaleString() }}</v-col
              >
            </v-row>
            <v-row class="mb-2">
              <v-col class="text-left"> สาขา: {{ receiptStore.editedReceipt.branch?.name }} </v-col>
            </v-row>
            <v-table height="300">
              <thead>
                <tr>
                  <th>รหัส</th>
                  <th>ชื่อสินค้า</th>
                  <th>ราคา</th>
                  <th>จำนวน</th>
                  <th>ราคารวม</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item of receiptStore.editedReceipt.receiptItems" :key="item.id">
                  <td>{{ item.id }}</td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.qty }}</td>
                  <td>{{ item.total }}</td>
                </tr>
              </tbody>
            </v-table>
            <v-row class="mt-5">
              <v-col cols="8"></v-col>
              <v-col cols="2" class="text-right">ยอดรวม: </v-col>
              <v-col cols="2">{{ receiptStore.editedReceipt.total }}</v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
