<template>
    fefef
</template>

<script setup>

import { usePage } from '@/libs/page';
import { useAppStore } from '@/store/app';

const store = useAppStore();

const page = usePage();
let title = store.configuration.
page.setPageTitle('entries.title');

</script>
