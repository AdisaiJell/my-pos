<script setup lang="ts">
import type { Product } from '@/types/Product'
import ProductCard from './ProductCard.vue'

const props = defineProps<{
  products: Product[]
}>()

const emit = defineEmits<{
  selectedProduct: [Product]
}>()

function selected(p: Product) {
  emit('selectedProduct', p)
}
</script>
<template>
  <div style="overflow: auto; height: 577px">
    <v-container>
      <v-row>
        <v-col cols="12" sm="6" md="4" v-for="item of products" :key="item.id">
          <product-card :product="item" @selectedProduct="selected"></product-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
