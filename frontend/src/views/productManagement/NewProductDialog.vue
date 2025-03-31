<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useProductStore } from '@/stores/product'
import { useSizeStore } from '@/stores/size'
import { useCategoryStore } from '@/stores/category'
import { useTypeStore } from '@/stores/type'

const productStore = useProductStore()

const refForm = ref<VForm | null>(null)
const sizeStore = useSizeStore()
const categoryStore = useCategoryStore()
const typeStore = useTypeStore()

function isNameExist(name: any): any {
  const product = productStore.products.find((item) => item.name === name)
  if (product?.id === productStore.editedProduct.id) {
    return null
  }
  return product
}

const nameRules = [
  (value: any) => {
    if (!value) {
      return 'กรุณากรอกชื่อสินค้า'
    } else if (isNameExist(value)) {
      return 'ชื่อนี้ถูกใช้ไปแล้ว'
    }
    return true
  }
]

const validPrice = ref(true)
const priceRules = [
  (value: number) => {
    if (!value) {
      return 'กรุณากรอกราคาสินค้า'
    } else if (value < 0) {
      validPrice.value = false
      return 'ราคาต่ำกว่า 0!'
    } else if (value > 999) {
      validPrice.value = false
      return 'ราคามากกว่า 999'
    }
    validPrice.value = true
    return true
  }
]

const comboboxRule = [
  (v: any) => {
    if (productStore.editedProduct.category.name === 'drink') {
      if (v.length == 0) {
        return 'กรุณากรอกข้อมูล'
      }
    }
    return true
  }
]

function closeDialog() {
  productStore.newProductDialog = false
}

async function save() {
  const { valid } = await refForm.value!.validate()

  if (!valid) return
  closeDialog()
  await productStore.saveProduct()
}

onMounted(async () => {
  await sizeStore.getSizes()
  await typeStore.getTypes()
  await categoryStore.getCategories()
})
</script>
<template>
  <v-dialog v-model="productStore.newProductDialog" persistent width="500" height="600">
    <v-form ref="refForm">
      <v-card>
        <v-toolbar flat color="#424242">
          <v-toolbar-title style="margin-left: 40px"> สินค้า </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="mb-2">ชื่อสินค้า:</div>
                <v-text-field
                  v-model="productStore.editedProduct.name"
                  label="ชื่อสินค้า"
                  required
                  clearable
                  single-line
                  :rules="nameRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">ราคา:</div>
                <v-text-field
                  :class="validPrice ? '' : 'text-red'"
                  v-model="productStore.editedProduct.price"
                  label="ราคา"
                  type="number"
                  min="0"
                  max="999"
                  required
                  clearable
                  single-line
                  :rules="priceRules"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">หมวดหมู่:</div>
                <v-select
                  v-model="productStore.editedProduct.category"
                  label="หมวดหมู่"
                  :items="categoryStore.categories"
                  :item-title="
                    (item: any) =>
                      item.name.substring(0, 1).toUpperCase() + item.name.substring(1).toLowerCase()
                  "
                  item-value="id"
                  :return-object="true"
                  required
                  single-line
                ></v-select>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-2">ชนิด:</div>
                <v-combobox
                  :disabled="
                    productStore.editedProduct.category.name === 'เครื่องดื่ม' ? false : true
                  "
                  v-model="productStore.editedProduct.types"
                  label="ชนิด"
                  :rules="comboboxRule"
                  :items="typeStore.types"
                  item-title="name"
                  item-value="id"
                  :return-object="true"
                  multiple
                  single-line
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="12">
                <div class="mb-2">ขนาด:</div>
                <v-combobox
                  :disabled="
                    productStore.editedProduct.category.name === 'เครื่องดื่ม' ? false : true
                  "
                  v-model="productStore.editedProduct.sizes"
                  :rules="comboboxRule"
                  label="ขนาด"
                  :items="sizeStore.sizes"
                  item-title="name"
                  item-value="id"
                  :return-object="true"
                  multiple
                  single-line
                ></v-combobox>
              </v-col>
              <v-col cols="12" md="5">
                <v-img
                  v-model="productStore.editedProduct.files"
                  :src="`http://localhost:3000/images/products/${productStore.editedProduct.image}`"
                  width="150"
                  height="150"
                  cover
                  class="ma-auto"
                ></v-img>
              </v-col>
              <v-col cols="12" md="7">
                <v-file-input
                  v-model="productStore.editedProduct.files"
                  :rules="[
                    (value: any) => {
                      return (
                        !value ||
                        !value.length ||
                        value[0].size < 2000000 ||
                        'Avatar size should be less than 2 MB!'
                      )
                    }
                  ]"
                  accept="image/png, image/jpeg, image/bmp"
                  label="เลือกรูปภาพ"
                  placeholder="Pick an avatar"
                  prepend-icon="mdi-camera"
                ></v-file-input>
              </v-col>
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
