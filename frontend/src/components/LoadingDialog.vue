<script setup lang="ts">
import { useLoadingStore } from '@/stores/loading'

const loadingStore = useLoadingStore()
</script>

<template>
  <v-dialog v-model="loadingStore.loading" persistent>
    <svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -9" result="cm" />
          <feBlend/>
        </filter>     
        <radialGradient id="radial-gradient" cx="20.5" cy="20.32" fx="5.9753758345333345" fy="4.511207610428622" r="23.94" gradientUnits="userSpaceOnUse">
          <stop offset="0.43" stop-color="#feb829"/>
          <stop offset="0.53" stop-color="#fdb125"/>
          <stop offset="0.68" stop-color="#f99d1a"/>
          <stop offset="0.85" stop-color="#f47c09"/>
          <stop offset="0.92" stop-color="#f16c00"/>
        </radialGradient>
        <symbol id="Yolk" data-name="Yolk" viewBox="0 0 41 41">
          <circle cx="20.5" cy="20.5" r="20.5" fill="url(#radial-gradient)"/>
          <path d="M5.59,18.78A15,15,0,0,1,23.65,5.83" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
        </symbol>
      </defs>
      <g class="whiteContainer" fill="#ede6e3" filter="url(#goo)">
        <circle cx="280" cy="300" r="41"/>
        <circle cx="360" cy="300" r="41"/>
        <circle cx="440" cy="300" r="41"/>
        <circle cx="520" cy="300" r="41"/>
      </g>
      <g class="yolkContainer">
        <use width="41" height="41" xlink:href="#Yolk" x="260" y="280"/>
        <use width="41" height="41" xlink:href="#Yolk" x="340" y="280"/>
        <use width="41" height="41" xlink:href="#Yolk" x="420" y="280"/>
        <use width="41" height="41" xlink:href="#Yolk" x="500" y="280"/>
      </g>
    </svg>
  </v-dialog>
</template>

