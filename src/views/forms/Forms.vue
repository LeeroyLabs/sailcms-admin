<template>
    <div>FORMS</div>
    <Listing
        ref="listing"
        :loading="false"
        :multi="true"
        :files="[]"
        mode="image"
        display-mode="grid"
    />
</template>

<script setup>
import { ref } from "vue";
import Listing from "@/components/globals/assetmanager/Listing.vue";

const listing = ref(null);
</script>

<style lang="scss" scoped></style>
