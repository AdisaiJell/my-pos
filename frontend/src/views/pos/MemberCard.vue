<script setup lang="ts">
import { ref } from 'vue'
import { watch } from 'vue'
import { useMemberStore } from '@/stores/member'
import { useReceiptStore } from '@/stores/receipt'
import MemberDialog from '@/views/memberManagement/MemberDialog.vue'
import type { VForm } from 'vuetify/components'

const memberStore = useMemberStore()
const receiptStore = useReceiptStore()

const refForm = ref<VForm | null>(null)

watch(
  () => memberStore.usePoint,
  () => {
    receiptStore.calReceipt()
  }
)

watch(
  () => memberStore.tel,
  (tel) => {
    if (tel === '' || tel === null) {
      searchMember()
    }
  }
)

async function searchMember() {
  memberStore.usePoint = 0
  await memberStore.searchMember()
  receiptStore.calReceipt()
}

function openMemberDialog() {
  memberStore.clear()
  memberStore.openDialog = true
}
</script>
<template>
  <v-overlay v-model="memberStore.memberLoading" contained class="justify-center align-center">
    <v-progress-circular color="amber" indeterminate></v-progress-circular>
  </v-overlay>
  <v-container>
    <v-form ref="refForm">
      <v-row no-gutters>
        <v-col cols="6">
          <v-text-field
            v-model="memberStore.tel"
            density="compact"
            variant="solo"
            label="ค้นหาสมาชิก"
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            clearable
            @click:append-inner="searchMember"
            @keyup.enter="searchMember"
          >
            <template v-slot:append>
              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-account-plus"
                    variant="text"
                    density="compact"
                    color="green"
                    @click="openMemberDialog()"
                  >
                  </v-btn>
                </template>
                สมัครสมาชิก
              </v-tooltip>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="1"></v-col>
        <v-col cols="5  ">
          <v-select
            :disabled="memberStore.currentMember ? false : true"
            v-model="memberStore.usePoint"
            :items="[
              { title: 'ไม่ใช้', value: 0 },
              {
                title: '50(ลด 10 บาท)',
                value: 50,
                props: { disabled: memberStore.currentMember?.point! >= 50 ? false : true }
              },
              {
                title: '100(ลด 20 บาท)',
                value: 100,
                props: { disabled: memberStore.currentMember?.point! >= 100 ? false : true }
              },
              {
                title: '200(ลด 40 บาท)',
                value: 200,
                props: { disabled: memberStore.currentMember?.point! >= 200 ? false : true }
              }
            ]"
            density="compact"
            label="แต้ม"
          ></v-select>
        </v-col>
        <v-col
          :cols="memberStore.currentMember ? 12 : 5"
          :class="memberStore.currentMember ? 'mt-2' : 'text-center mt-2'"
        >
          <v-chip
            size="large"
            :color="memberStore.currentMember ? 'green' : ''"
            class="overflow-auto"
            :prepend-icon="memberStore.currentMember ? 'mdi-star' : ''"
          >
            {{
              memberStore.currentMember
                ? 'ชื่อ : ' + memberStore.currentMember?.name
                : 'ไม่พบสมาชิก'
            }}
          </v-chip>
          <v-chip
            v-if="memberStore.currentMember ? true : false"
            size="large"
            :color="memberStore.currentMember ? 'green' : ''"
            class="overflow-auto"
          >
            {{ memberStore.currentMember ? 'เเต้มสะสม: ' + memberStore.currentMember.point : '' }}
          </v-chip>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
  <member-dialog></member-dialog>
</template>
