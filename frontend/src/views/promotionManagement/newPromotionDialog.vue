<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { usePromotionStore } from '@/stores/promotion'
import { useProductStore } from '@/stores/product'
import { usePromotionTypeStore } from '@/stores/promotionType'
import type { PromotionType } from '@/types/PromotionType'
import type { Product } from '@/types/Product'

const promotionStore = usePromotionStore()
const productStore = useProductStore()
const promotionTypeStore = usePromotionTypeStore()
const refForm = ref<VForm | null>(null)

function closeDialog() {
  promotionStore.newPromotionDialog = false
}

const timeRules = [
  (v: string) => {
    if (!v) {
      return 'กรุณาเลือกเวลา'
    } else if (new Date(v) < new Date()) {
      return 'กรุณาเลือกเวลาปัจจุบัน'
    }
    return true
  }
]

const promotionName = [
  (v: string) => {
    if (!v) {
      return 'กรุณากรอกชื่อโปรโมชัน'
    } else if (isPromoNameExist(v)) {
      return 'ชื่อนี้ถูกใช้ไปเเล้ว'
    }
    return true
  }
]

function isPromoNameExist(name: string): any {
  const editedPromotion = promotionStore.promotions.find((item) => item.name === name)
  if (editedPromotion?.id === promotionStore.editedPromotion.id) {
    return null
  }
  return editedPromotion
}

const comboboxRules = [
  (v: Product[]) => {
    if (v.length <= 0) {
      return 'กรุณาเลือกสินค้า'
    }
    return true
  }
]

const minimunRules = [
  (v: number) => {
    if (v < 0) {
      return 'กรุณากรอกข้อมูลให้ถูกต้อง'
    } else if (v === 0) {
      return true
    } else if (!v) {
      return 'กรุณาเลือกหรือกรอกราคาขั้นต่ำ'
    }
    return true
  }
]

async function save() {
  const { valid } = await refForm.value!.validate()

  if (!valid) return
  closeDialog()
  await promotionStore.savePromotion()
}

onMounted(async () => {
  await productStore.getProducts()
  await promotionTypeStore.getPromotionTypes()
})
</script>
<template>
  <v-dialog v-model="promotionStore.newPromotionDialog" persistent width="500" height="600">
    <v-form ref="refForm">
      <v-card>
        <!-- <v-card-title class="text-center">
          <span class="text-h5">Promotion</span>
        </v-card-title> -->
        <v-toolbar flat color="#424242">
          <v-toolbar-title style="margin-left: 40px"> โปรโมชั่น </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="mb-2">ชื่อโปรโมชั่น:</div>
                <v-text-field
                  v-model="promotionStore.editedPromotion.name"
                  label="ชื่อโปรโมชั่น"
                  required
                  clearable
                  single-line
                  :rules="promotionName"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">รายการอาหารในโปรโมชั่น:</div>
                <v-combobox
                  v-model="promotionStore.editedPromotion.promoProducts"
                  :items="productStore.products"
                  clearable
                  label="รายการอาหาร"
                  item-title="name"
                  item-value="id"
                  multiple
                  single-line
                  :rules="comboboxRules"
                  :return-object="true"
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">เลือกโปรโมชั่น:</div>
                <v-select
                  v-model="promotionStore.editedPromotion.promotionType"
                  :items="promotionTypeStore.promotionPromotionTypes"
                  clearable
                  single-line
                  label="โปรโมชั่น"
                  item-title="name"
                  item-value="id"
                  :rules="[(v: PromotionType) => !!v || 'กรุณาเลือกประเภทโปรโมชัน']"
                  :return-object="true"
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">ส่วนลด (%):</div>
                <v-select
                  :disabled="
                    promotionStore.editedPromotion.promotionType?.name !== 'ส่วนลด' ? true : false
                  "
                  v-model="promotionStore.editedPromotion.discount"
                  :items="[
                    { title: '25%', value: 0.25 },
                    { title: '50%', value: 0.5 },
                    { title: '60%', value: 0.6 }
                  ]"
                  clearable
                  single-line
                  auto-select-first
                  label="Discount (%)"
                  :rules="
                    promotionStore.editedPromotion.promotionType?.name !== 'ส่วนลด'
                      ? []
                      : [(v: any) => !!v || 'กรุณาเลือกส่วนลด']
                  "
                  :return-object="false"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">ขั้นต่ำ (บาท):</div>
                <v-combobox
                  v-model="promotionStore.editedPromotion.minimum"
                  :items="[
                    { title: '0', value: 0 },
                    { title: '100', value: 100 },
                    { title: '150', value: 150 },
                    { title: '250', value: 250 }
                  ]"
                  clearable
                  type="number"
                  single-line
                  label="ราคาขั้นต่ำ (บาท)"
                  :rules="minimunRules"
                  :return-object="false"
                ></v-combobox>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">วันที่เริ่ม:</div>
                <v-text-field
                  v-model="promotionStore.editedPromotion.startDate"
                  label="Start Date"
                  type="datetime-local"
                  :rules="timeRules"
                  clearable
                  single-line
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">วันที่สิ้นสุด:</div>
                <v-text-field
                  v-model="promotionStore.editedPromotion.endDate"
                  label="End Date"
                  type="datetime-local"
                  :rules="timeRules"
                  clearable
                  single-line
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4"> </v-col>
              <v-col cols="12" md="4"> </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-row>
            <v-col cols="12" sm="4">
              <v-btn variant="text" block @click="closeDialog()"> ยกเลิก </v-btn>
            </v-col>
            <v-col cols="12" sm="8">
              <v-btn color="blue" variant="flat" block @click="save()"> บันทึก </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
