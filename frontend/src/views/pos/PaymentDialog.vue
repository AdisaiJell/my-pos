<script setup lang="ts">
import { ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { useReceiptStore } from '@/stores/receipt'
import { useMemberStore } from '@/stores/member'
import type { ReceiptItem } from '@/types/ReceiptItem'
import generatePayload from 'promptpay-qr'
import qrcode from 'qrcode'

const receiptStore = useReceiptStore()
const memberStore = useMemberStore()
const refForm = ref<VForm | null>(null)

//generate QRcode
const qrCodeData = ref('')
const mobileNumber = '0123456789'
let amount = 0
let payload = generatePayload(mobileNumber, { amount })

watch(
  () => {
    receiptStore.cash
  },
  () => {
    receiptStore.calChange()
  },
  { deep: true }
)

function generateQRcode() {
  amount = receiptStore.receipt.total
  payload = generatePayload(mobileNumber, { amount })
  qrcode.toDataURL(payload, { type: 'png' }, (err: any, url: any) => {
    if (err) {
      console.error(err)
    } else {
      qrCodeData.value = url
    }
  })
}

function payCash() {
  receiptStore.payType = 'cash'
}
function payPromtpay() {
  receiptStore.payType = 'promtpay'
  generateQRcode()
}

const cashRules = [
  (value: number) => {
    if (!value) {
      return 'กรุณาใส่จำนวนเงิน'
    } else if (value < receiptStore.receipt.total) {
      return 'จำนวนเงินไม่พอ!'
    }
    return true
  }
]

function closeDialog() {
  receiptStore.paymentDialog = false
}

async function save() {
  const { valid } = await refForm.value!.validate()
  if (!valid) return
  if (memberStore.currentMember) {
    memberStore.receivePoint = Math.floor(receiptStore.receipt.totalBefore / 5)
  }
  receiptStore.paymentDialog = false
  receiptStore.showReceiptDialog()
}

function detailItem(item: ReceiptItem): string {
  let strDetail = ''
  if (item.size && item.type) {
    strDetail += `(${item.size.name})(${item.type.name})(${item.sweetLv}%)`
  }
  return strDetail
}
</script>
<template>
  <v-dialog v-model="receiptStore.paymentDialog" persistent max-width="500">
    <v-form ref="refForm">
      <v-card rounded="lg">
        <v-card-title class="text-h5 text-center"> รายการสินค้า </v-card-title>
        <v-card-text>
          <div style="min-height: 200px; max-height: 300px; overflow: auto">
            <v-table>
              <thead>
                <tr>
                  <td>ลำดับ</td>
                  <td>ชื่อสิ้นค้า</td>
                  <td>ราคา</td>
                  <td>จำนวนชิ้น</td>
                  <td>ราคารวม</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) of receiptStore.receiptItems" :key="item.id">
                  <td>{{ index + 1 }}</td>
                  <td max-width="5">
                    {{ item.name + detailItem(item) }}
                  </td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.unit }}</td>
                  <td>{{ item.price * item.unit }}</td>
                </tr>
              </tbody>
            </v-table>
          </div>
          <v-container class="pa-0 mt-16">
            <v-row>
              <v-col cols="6"
                ><v-row no-gutters class="ga-2">
                  <v-col cols="12">ยอดรวม: {{ receiptStore.receipt.totalBefore }}</v-col>
                  <v-col cols="12">
                    ส่วนลด:
                    <span class="text-red"
                      >-{{
                        receiptStore.receipt.memberDiscount + receiptStore.receipt.promotionDiscount
                      }}</span
                    >
                  </v-col>
                  <v-col cols="12">ยอดสุทธิ: {{ receiptStore.receipt.total }}</v-col>
                  <v-col cols="12">เงินทอน: {{ receiptStore.receipt.change }}</v-col>
                </v-row></v-col
              >
              <v-col cols="6">
                <v-row no-gutters>
                  <v-col cols="12" sm="6" class="text-center">จ่ายเงิน:</v-col>
                  <v-col cols="12" sm="6" class="text-right">
                    <v-btn
                      v-if="
                        receiptStore.payType === 'cash' || receiptStore.payType === 'promtpay'
                          ? false
                          : true
                      "
                      color="green"
                      width="120"
                      prepend-icon="mdi-cash-multiple"
                      @click="payCash()"
                      >เงินสด</v-btn
                    >
                    <v-text-field
                      v-if="receiptStore.payType === 'cash'"
                      v-model="receiptStore.cash"
                      type="number"
                      label="Cash"
                      density="compact"
                      variant="outlined"
                      min="0"
                      :rules="cashRules"
                      class="text-left"
                    ></v-text-field>
                    <v-img
                      v-if="receiptStore.payType === 'promtpay'"
                      :src="qrCodeData"
                      height="100"
                      width="100"
                    ></v-img>
                  </v-col>
                  <v-col cols="12" sm="6"></v-col>
                  <v-col cols="12" sm="6" class="text-right mt-1">
                    <v-btn
                      v-if="
                        receiptStore.payType === 'cash' || receiptStore.payType === 'promtpay'
                          ? false
                          : true
                      "
                      color="purple"
                      width="120"
                      prepend-icon="mdi-qrcode-scan"
                      @click="payPromtpay()"
                      cover
                      >พร้อมเพย์</v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="mt-3">
          <v-spacer></v-spacer>
          <v-btn color="green-darken-1" variant="text" @click="closeDialog()"> ยกเลิก </v-btn>
          <v-btn
            color="green-darken-1"
            variant="text"
            @click="save()"
            :disabled="receiptStore.payType ? false : true"
          >
            ยืนยัน
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
