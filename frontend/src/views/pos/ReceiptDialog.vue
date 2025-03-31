<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useMemberStore } from '@/stores/member'
import { useReceiptStore } from '@/stores/receipt'
import type { ReceiptItem } from '@/types/ReceiptItem'
import html2pdf from 'html2pdf.js'

const receiptStore = useReceiptStore()
const memberStore = useMemberStore()
const authStore = useAuthStore()

async function closeDialog() {
  receiptStore.receiptDialog = false
  html2pdf(document.getElementById('receipt'), {
    margin: 10,
    filename: 'receipt-goodluck-coffee.pdf'
  })
  await receiptStore.saveReceipt()
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
  <v-dialog v-model="receiptStore.receiptDialog" persistent max-width="415">
    <v-card>
      <div id="receipt">
        <v-card-title class="text-h5 text-center"> ใบเสร็จ </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="text-center" no-gutters>
              <v-col cols="12">
                CP ALL,GoodLuck-Coffee<br />เกาะสวรรค์(00285) TAX010#01075420000011 (VAT Included )
                Vat Code 01664 POS#E001 <br />
                ใบเสร็จรับเงิน/ใบกำกับภาษีอย่างย่อ
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-table>
                  <thead>
                    <tr>
                      <td>รายการ</td>
                      <td>ราคา</td>
                      <td>จำนวน</td>
                      <td>ราคารวม</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item of receiptStore.receiptItems" :key="item.id">
                      <td max-width="5">
                        {{ item.name + detailItem(item) }}
                      </td>
                      <td>{{ item.price }}</td>
                      <td>{{ item.unit }}</td>
                      <td>{{ item.price * item.unit }}</td>
                    </tr>
                  </tbody>
                </v-table>
                <v-col cols="12" class="text-center"
                  >_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</v-col
                >
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="6">ยอดรวม</v-col>
              <v-col cols="6"> {{ receiptStore.receipt.totalBefore }}</v-col>
              <v-col cols="6">ส่วนลด</v-col>
              <v-col cols="6">
                -{{
                  receiptStore.receipt.memberDiscount + receiptStore.receipt.promotionDiscount
                }}</v-col
              >
              <v-col cols="6">สุทธิ {{ receiptStore.receipt.receiptItems?.length }} ชิ้น </v-col>
              <v-col cols="6"> {{ receiptStore.receipt.total }}</v-col>
              <v-col cols="6">เงินสด/เงินทอน</v-col>
              <v-col cols="3">
                <span
                  v-text="
                    receiptStore.payType === 'promtpay' ? 'PromtPay' : Number(receiptStore.cash)
                  "
                ></span>
              </v-col>
              <v-col cols="3">
                <span
                  v-text="receiptStore.payType === 'promtpay' ? '' : receiptStore.receipt.change"
                >
                </span
              ></v-col>
            </v-row>
            <v-row no-gutters>
              <v-col cols="12" class="text-center"
                >_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
              </v-col>
              <v-col cols="6" class="mt-5">ข้อมูลสมาชิก:</v-col>
              <v-col cols="6" class="mt-5 mb-2"
                ><span
                  v-text="
                    receiptStore.receipt.member?.name ? receiptStore.receipt.member?.name : '-'
                  "
                ></span
              ></v-col>
              <v-col cols="3"> </v-col>
              <v-col cols="3">ได้รับ</v-col>
              <v-col cols="3">ใช้ไป</v-col>
              <v-col cols="3">คงเหลือ</v-col>
              <v-col cols="3">เเต้มสมาชิก:</v-col>
              <v-col cols="3">{{ memberStore.receivePoint }}</v-col>
              <v-col cols="3">{{ memberStore.usePoint }}</v-col>
              <v-col cols="3">{{
                memberStore.currentMember
                  ? memberStore.currentMember.point -
                    memberStore.usePoint +
                    memberStore.receivePoint
                  : '0'
              }}</v-col>
              <v-col cols="12" class="text-center"
                >_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _</v-col
              >
              <v-col cols="12" class="text-left">
                พนักงาน: {{ authStore.currentUser?.fullName }}
              </v-col>
            </v-row>
          </v-container>
          <v-col cols="12" class="text-left">
            **วันที่: {{ receiptStore.receipt.createdDate.toLocaleString() }}**
          </v-col>
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green-darken-1" variant="text" @click="closeDialog()"> ยืนยัน </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
