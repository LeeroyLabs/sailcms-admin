<template>
    <div class="tw-m-4">
        Dashboard
    </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/app";

// Set page title
const store = useAppStore();
store.setPageTitle('Dashboard');
document.title = 'Dashboard — SailCMS';

// Set Breadcrumb
store.setBreadcrumbs([]);
</script>
