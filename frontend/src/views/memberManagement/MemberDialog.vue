<script setup lang="ts">
import { useMemberStore } from '@/stores/member'
import type { Member } from '@/types/Member'
import { ref } from 'vue'
import type { VForm } from 'vuetify/components'

const memberStore = useMemberStore()
const refForm = ref<VForm | null>(null)

const telRules = [
  (value: any) => {
    if (!value) {
      return 'กรุณากรอกเบอร์โทรศัพท์'
    } else if (memberStore.editedMember.tel.length !== 10) {
      return 'กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 ตัว'
    } else if (checkTel()) {
      return 'เบอร์นี้ถูกใช้ไปแล้ว'
    }
    return true
  }
]

function checkTel(): boolean {
  const index = memberStore.members.findIndex((item) => item.tel === memberStore.editedMember.tel)
  if (index > -1 && memberStore.editedMember.id === -1) {
    return true
  } else if (checkMemberTel()) {
    return true
  }
  return false
}

function checkMemberTel(): Member | undefined {
  const obj: Member | undefined = memberStore.members.find(
    (item) => item.tel === memberStore.editedMember.tel && item.id !== memberStore.editedMember.id
  )
  return obj
}

async function save() {
  const { valid } = await refForm.value!.validate()
  if (!valid) return

  closeDialog()
  await memberStore.saveMember()
}

function closeDialog() {
  memberStore.openDialog = false
}
</script>
<template>
  <v-dialog persistent v-model="memberStore.openDialog" width="400">
    <v-form ref="refForm">
      <v-card style="overflow-y: hidden;">
        <v-toolbar flat color="#424242">
          <v-toolbar-title style="margin-left: 40px;"> สมาชิก </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <div class="mb-2">ชื่อ:</div>
                <v-text-field v-model="memberStore.editedMember.name" label="ชื่อ" required single-line clearable
                  :rules="[(v) => !!v || 'กรุณากรอกข้อมูล']">
                </v-text-field>
              </v-col>
              <v-col cols="12">
                <div class="mb-2">เบอร์โทรศัพท์:</div>
                <v-text-field v-model="memberStore.editedMember.tel" label="เบอร์โทรศัพท์" required clearable single-line
                  :rules="telRules">
                </v-text-field>
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
