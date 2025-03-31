<script setup lang="ts">
import { usePromotionStore } from '@/stores/promotion'

const promotionStore = usePromotionStore()

function closeDelDialog() {
  promotionStore.delPromotionDialog = false
  promotionStore.clear()
}

async function deletePromotion() {
  promotionStore.delPromotionDialog = false
  await promotionStore.deletePromotion()
  promotionStore.clear()
}
</script>
<template>
<v-dialog v-model="promotionStore.delPromotionDialog"  max-width="400px">
    <v-card rounded="xl" style="overflow-y: hidden;">
      <v-toolbar flat color="#424242">
          <v-toolbar-title class="text-center" > ลบโปรโมชั่น </v-toolbar-title>
      </v-toolbar>
      <div style="margin: auto; padding: 20px; font-size: 16px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการลบโปรโมชั่นนี้?
      </div>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-row>
          <v-col>
            <v-btn color="blue" variant="text" size="x-large" @click="closeDelDialog()">ยกเลิก</v-btn>
          </v-col>
          <v-divider class="mx-4 custom-divider" inset vertical></v-divider>
          <v-col>
            <v-btn color="red" variant="text" size="x-large" @click="deletePromotion()">ลบ</v-btn>
          </v-col>
        </v-row>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <v-dialog persistent v-model="promotionStore.delPromotionDialog" max-width="500px">
    <v-card>
      <div style="margin: auto; padding: 15px 5px; font-size: 20px; text-align: center">
        คุณแน่ใจหรือไม่ว่าต้องการลบโปรโมชั่นนี้?
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDelDialog()"> ยกเลิก </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="deletePromotion()"> ลบ </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>
