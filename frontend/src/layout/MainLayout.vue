<template>
  <v-layout class="mainLayout">
    <router-view name="header"></router-view>
    <router-view name="menu"></router-view>
    <v-main class="align-center justify-center" style="min-height: 300px">
      <router-view></router-view>
    </v-main>
  </v-layout>
</template>
