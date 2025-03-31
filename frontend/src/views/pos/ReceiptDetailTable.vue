<script setup lang="ts">
import { useReceiptStore } from '@/stores/receipt'
import type { ReceiptItem } from '@/types/ReceiptItem'

const receiptStore = useReceiptStore()

function detailItem(item: ReceiptItem): string {
  let strDetail = ''
  if (item.size && item.type) {
    strDetail += `(${item.size.name})(${item.type.name})(${item.sweetLv}%)`
  }
  return strDetail
}
</script>
<template>
  <v-table>
    <thead class="bg-grey-darken-4">
      <tr class="bg-grey-darken-4">
        <th>ลำดับ</th>
        <th>รายการ</th>
        <th>ราคา</th>
        <th class="text-center">จำนวน</th>
        <th>รวม</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in receiptStore.receiptItems" :key="item.id">
        <td>{{ index + 1 }}</td>
        <td>
          <span
            v-text="
              (item.name + detailItem(item)).length <= 25
                ? item.name + detailItem(item)
                : (item.name + detailItem(item)).substring(0, 15) + '...'
            "
          ></span>
        </td>
        <td>{{ item.price }}</td>
        <td class="text-center">
          <v-btn
            icon="mdi-minus"
            size="x-small"
            variant="tonal"
            @click="receiptStore.dec(item)"
          ></v-btn>
          {{ item.unit }}
          <v-btn
            icon="mdi-plus"
            size="x-small"
            variant="tonal"
            @click="receiptStore.inc(item)"
          ></v-btn>
        </td>
        <td>{{ item.price * item.unit }}</td>
        <td>
          <v-btn
            icon="mdi-delete"
            density="compact"
            variant="text"
            color="red"
            @click="receiptStore.removeReceiptItem(item)"
          ></v-btn>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
