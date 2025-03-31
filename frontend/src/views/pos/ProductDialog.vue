<script setup lang="ts">
import { usePosStore } from '@/stores/pos'
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

const posStore = usePosStore()

const refForm = ref<VForm | null>(null)

function closeProductDialog() {
  posStore.productDialog = false
  posStore.clear()
}

async function saveProduct() {
  const { valid } = await refForm.value!.validate()
  if (!valid) return

  posStore.saveSelectedProduct()
  closeProductDialog()
}

function convertSizeName(name: string): string {
  if (name === 's') {
    return 'เล็ก'
  } else if (name === 'm') {
    return 'กลาง'
  }
  return 'ใหญ่'
}
function convertTypeName(name: string): string {
  if (name === 'h') {
    return 'ร้อน'
  } else if (name === 'c') {
    return 'เย็น'
  }
  return 'ปั่น'
}
</script>
<template>
  <v-dialog v-model="posStore.productDialog" persistent max-width="500" max-height="555">
    <v-form ref="refForm">
      <v-card rounded="xl">
        <v-img
          :src="`http://localhost:3000/images/products/${posStore.selectedProduct.product.image}`"
          height="150"
          cover
        ></v-img>
        <v-card-title class="text-h5 text-center">
          {{ posStore.selectedProduct.name }}
        </v-card-title>
        <v-card-text>
          <v-radio-group
            class="text-center"
            inline
            v-model="posStore.selectedProduct.size"
            :rules="[(v: any) => !!v || 'กรุณาเลือกขนาด']"
          >
            <v-container class="text-center pa-0">
              <v-row no-gutters>
                <v-col cols="12" class="text-left"> ขนาด: </v-col>
                <v-col
                  cols="4"
                  v-for="item of posStore.selectedProduct.product?.sizes"
                  :key="item.id"
                >
                  <v-radio :label="convertSizeName(item.name)" :value="item"></v-radio>
                </v-col>
              </v-row>
            </v-container>
          </v-radio-group>
          <v-radio-group
            class="text-center"
            inline
            v-model="posStore.selectedProduct.type"
            :rules="[(v: any) => !!v || 'กรุณาเลือกประเภท']"
          >
            <v-container class="text-center pa-0">
              <v-row no-gutters>
                <v-col cols="12" class="text-left"> ประเภท: </v-col>
                <v-col
                  cols="4"
                  v-for="item of posStore.selectedProduct.product?.types"
                  :key="item.id"
                >
                  <v-radio :label="convertTypeName(item.name)" :value="item"></v-radio>
                </v-col>
              </v-row>
            </v-container>
          </v-radio-group>
          <v-radio-group
            class="text-center"
            inline
            v-model="posStore.selectedProduct.sweetLv"
            :rules="[(v: any) => !!v || 'กรุณาเลือกระดับความหวาน']"
          >
            <v-container class="text-center pa-0">
              <v-row no-gutters>
                <v-col cols="12" class="text-left">ควมหวาน:</v-col>
                <v-col cols="4">
                  <v-radio label="100%" value="100"></v-radio>
                </v-col>
                <v-col cols="4">
                  <v-radio label="150%" value="150"></v-radio>
                </v-col>
                <v-col cols="4">
                  <v-radio label="200%" value="200"></v-radio>
                </v-col>
              </v-row>
            </v-container>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn color="red" variant="text" @click="closeProductDialog()">
            <v-icon size="30">mdi-close-circle</v-icon> ยกเลิก
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="saveProduct()">
            <v-icon size="30">mdi-check-circle</v-icon> ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
