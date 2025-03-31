<script setup lang="ts">
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()

function closeDelDialog() {
  productStore.delProductDialog = false
  productStore.clear()
}

async function deleteProduct() {
  productStore.delProductDialog = false
  await productStore.deleteProduct()
  productStore.clear()
}
</script>
<template>
<v-dialog v-model="productStore.delProductDialog"  max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden;">
      <v-toolbar flat color="#424242">
          <v-toolbar-title class="text-center" > ลบสินค้า </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn color="blue" variant="text" size="x-large" @click="closeDelDialog()">ยกเลิก</v-btn>
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col>
            <v-btn color="red" variant="text" size="x-large" @click="deleteProduct()">ลบ</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
