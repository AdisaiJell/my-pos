<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useProductStore } from '@/stores/product'
import type { Product } from '@/types/Product'
import NewProductDialog from '../productManagement/NewProductDialog.vue'
import DelProductDialog from './DelProductDialog.vue'
import type { Type } from '@/types/Type'
import type { Category } from '@/types/Category'

const search = ref('')
const productStore = useProductStore()

const headers = [
  { key: 'id', title: 'ID', value: 'id' },
  { key: 'image', title: 'รูปภาพ' },
  { key: 'name', title: 'ชื่อ', value: 'name' },
  { key: 'price', title: 'ราคา', value: 'price' },
  { key: 'catagery', title: 'หมวดหมู่', value: (item: Category | any) => item.category.name },
  {
    key: 'sizes',
    title: 'ขนาด',
    value: (item: any | Product) => item.sizes.map((s: any) => s.name).join(',')
  },
  {
    key: 'types',
    title: 'ชนิด',
    value: (item: any | Type) => item.types.map((t: any) => t.name).join(',')
  },
  { key: 'actions', title: 'แก้ไข, ลบ', sortable: false }
]

async function editProduct(item: Product) {
  if (item.id) {
    await productStore.getProduct(item.id)
  }
  productStore.newProductDialog = true
}

function openDelDialog(item: Product) {
  if (item.id) {
    productStore.getProduct(item.id)
  }
  productStore.delProductDialog = true
}

function openDialog() {
  productStore.clear()
  productStore.newProductDialog = true
}

onMounted(async () => {
  await productStore.getProducts()
})
</script>
<template>
  <v-card flat class="ma-5" elevation="3">
    <v-data-table :headers="headers" :items="productStore.products" :search="search" height="484">
      <template v-slot:top>
        <v-toolbar flat color="grey-darken-4">
          <v-toolbar-title> สินค้า </v-toolbar-title>
          <v-row>
            <v-col></v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="search"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="ค้นหา"
                class="custom-text-field"
                hide-details
                single-line
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-btn
            rounded="lg"
            variant="flat"
            color="amber"
            size="small"
            icon="mdi-food"
            @click="openDialog()"
          ></v-btn>
          <new-product-dialog></new-product-dialog>
          <del-product-dialog></del-product-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" size="small" icon="mdi-pencil" @click="editProduct(item)"></v-icon>
        <v-icon size="small" icon="mdi-delete" @click="openDelDialog(item)"></v-icon>
      </template>
      <template v-slot:[`item.image`]="{ item }">
        <v-img
          :src="`http://localhost:3000/images/products/${item.image}`"
          width="150"
          height="150"
          cover
        ></v-img>
      </template>
    </v-data-table>
  </v-card>
</template>
