<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import type { Product } from '@/types/Product'
import ProductList from './ProductList.vue'
import ReceiptDetailTable from './ReceiptDetailTable.vue'
import ReceiptCard from './ReceiptCard.vue'
import MemberCard from './MemberCard.vue'
import ReceiptDialog from './ReceiptDialog.vue'
import CancelReceiptDialog from './CancelReceiptDialog.vue'
import ProductDialog from './ProductDialog.vue'
import PaymentDialog from './PaymentDialog.vue'
import { useReceiptStore } from '@/stores/receipt'
import { useProductStore } from '@/stores/product'
import { watch } from 'vue'
import { usePosStore } from '@/stores/pos'
import PromotionSnackbar from '@/components/PromotionSnackbar.vue'

const receiptStore = useReceiptStore()
const productStore = useProductStore()
const posStore = usePosStore()

const tab = ref(1)

const divTableReceipt = ref<HTMLElement | null>(null)

//scrollDiv to bottom
watch(
  () => receiptStore.receiptItems.length,
  () => {
    nextTick(() => {
      divTableReceipt.value?.scrollTo({
        top: divTableReceipt.value.scrollHeight,
        behavior: 'smooth'
      })
    })
  }
)

const selected = (p: Product) => {
  const selectProduct: Product = JSON.parse(JSON.stringify(p))
  posStore.openProductDialog(selectProduct)
}

const showPayment = () => {
  if (receiptStore.receiptItems.length === 0) return
  receiptStore.payType = ''
  receiptStore.cash = 0
  receiptStore.showPaymentDialog()
}

function showCancelReceiptDialog() {
  if (receiptStore.receiptItems.length === 0) return
  receiptStore.cancelReceiptDialog = true
}
onMounted(async () => {
  await posStore.initialPos()
})
</script>
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-sheet height="650" elevation="3" rounded="xl" color="grey-darken-4">
          <v-tabs fixed-tabs v-model="tab" color="amber" align-tabs="start">
            <v-tab :value="1" prepend-icon="mdi-coffee">เครื่องดื่ม</v-tab>
            <v-tab :value="2" prepend-icon="mdi-cupcake">ขนมหวาน</v-tab>
            <v-tab :value="3" prepend-icon="mdi-hamburger">อาหาร</v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="1">
              <product-list
                :products="
                  productStore.products.filter((obj) => obj.category.name === 'เครื่องดื่ม')
                "
                @selectedProduct="selected"
              ></product-list>
            </v-window-item>
            <v-window-item :value="2">
              <product-list
                :products="productStore.products.filter((obj) => obj.category.name === 'ขนมหวาน')"
                @selectedProduct="selected"
              ></product-list>
            </v-window-item>
            <v-window-item :value="3">
              <product-list
                :products="productStore.products.filter((obj) => obj.category.name === 'อาหาร')"
                @selectedProduct="selected"
              ></product-list>
            </v-window-item>
          </v-window>
        </v-sheet>
      </v-col>
      <v-col cols="12" md="6">
        <v-container class="pa-0">
          <v-row no-gutters class="ga-3">
            <v-col cols="12">
              <v-card elevation="3" rounded="xl">
                <div ref="divTableReceipt" style="height: 265px" class="overflow-auto">
                  <receipt-detail-table></receipt-detail-table>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card height="135" elevation="3" rounded="xl">
                <member-card></member-card>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-sheet height="130" elevation="3" rounded="xl">
                <receipt-card></receipt-card>
              </v-sheet>
            </v-col>
            <v-col cols="12">
              <v-btn color="red" width="900" rounded="xl" @click="showCancelReceiptDialog()">
                <v-icon left>mdi-close</v-icon>
                ยกเลิก
              </v-btn>
            </v-col>
            <v-col cols="12">
              <v-btn color="green" width="900" rounded="xl" @click="showPayment">
                <v-icon left>mdi-cash</v-icon>
                ชำระเงิน
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
  <receipt-dialog></receipt-dialog>
  <cancel-receipt-dialog></cancel-receipt-dialog>
  <product-dialog></product-dialog>
  <payment-dialog></payment-dialog>
  <promotion-snackbar></promotion-snackbar>
</template>
