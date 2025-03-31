<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePromotionStore } from '@/stores/promotion'
import type { Promotion } from '@/types/Promotion'
import NewPromotionDialog from './newPromotionDialog.vue'
import DelPromotionDialog from './DelPromotionDialog.vue'

const search = ref('')
const promotionStore = usePromotionStore()
const headers = [
  { title: 'ID', key: 'id', value: 'id' },
  { title: 'ชื่อ', key: 'name', value: 'name' },
  {
    title: 'วันที่เริ่ม',
    key: 'startDate',
    value: (item: any | Promotion) => {
      const startDate = new Date(item.startDate).toLocaleString()
      return startDate
    }
  },
  {
    title: 'วันที่สิ้นสุด',
    key: 'endDate',
    value: (item: any | Promotion) => {
      const endDate = new Date(item.endDate).toLocaleString()
      return endDate
    }
  },
  {
    title: 'รายการอาหาร',
    key: 'promoProducts',
    value: (item: any | Promotion) => item.promoProducts.map((p: any) => p.name).join(',')
  },
  {
    title: 'ประเภท',
    key: 'promotionType',
    value: (item: any | Promotion) => item.promotionType.name
  },
  {
    title: 'ราคาขั้นต่ำ',
    key: 'minimum',
    value: 'minimum'
  },
  {
    title: 'ส่วนลด',
    key: 'discount',
    value: (item: any | Promotion) => item.discount * 100 + '%'
  },
  {
    title: 'สถานะ',
    key: 'status'
  },
  { title: 'แก้ไข, ลบ', key: 'actions', sortable: false }
]

const openDialog = () => {
  promotionStore.clear()
  promotionStore.newPromotionDialog = true
}

async function editPromotion(item: Promotion) {
  if (item.id) {
    await promotionStore.getPromotion(item.id)
  }
  promotionStore.newPromotionDialog = true
}
async function openDelDialog(item: Promotion) {
  if (item.id) {
    await promotionStore.getPromotion(item.id)
  }
  promotionStore.delPromotionDialog = true
}

onMounted(async () => {
  await promotionStore.getPromotions()
})
</script>
<template>
  <v-card flat class="ma-5" elevation="3">
    <v-data-table
      :headers="headers"
      :items="promotionStore.promotions"
      :search="search"
      height="484"
    >
      <template v-slot:top>
        <v-toolbar flat color="grey-darken-4">
          <v-toolbar-title> โปรโมชั่น </v-toolbar-title>
          <v-row>
            <v-col></v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="search"
                variant="outlined"
                append-inner-icon="mdi-magnify"
                density="compact"
                label="ค้นหาชื่อโปรโมชั่น"
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
            icon="mdi-sale"
            @click="openDialog()"
          ></v-btn>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon class="mr-2" size="small" icon="mdi-pencil" @click="editPromotion(item)"></v-icon>
        <v-icon size="small" icon="mdi-delete" @click="openDelDialog(item)"></v-icon>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <span
          v-text="item.endDate >= new Date().toISOString() ? 'True' : 'False'"
          :class="item.endDate >= new Date().toISOString() ? 'text-green' : 'text-red'"
        ></span>
      </template>
    </v-data-table>
    <new-promotion-dialog></new-promotion-dialog>
    <del-promotion-dialog></del-promotion-dialog>
  </v-card>
</template>
