<script setup lang="ts">
import type { Product } from '@/types/Product'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  selectedProduct: [Product]
}>()

const selected = () => {
  emit('selectedProduct', props.product)
}
</script>
<template>
  <v-card width="165" height="165" elevation="2" rounded @click="selected">
    <v-img
      :src="`http://localhost:3000/images/products/${product.image}`"
      cover
      height="120"
    ></v-img>
    <div style="text-align: center">{{ product.name }}<br />{{ product.price }} บาท</div>
  </v-card>
</template>
