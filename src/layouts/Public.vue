<template>
    <v-app>
        <v-main class="tw-h-full tw-flex tw-flex-row tw-items-center">
            <router-view/>
        </v-main>
    </v-app>

    <Toast :public="true"/>
</template>

<script setup>
import Toast from '@/components/globals/Toast.vue';
</script>
