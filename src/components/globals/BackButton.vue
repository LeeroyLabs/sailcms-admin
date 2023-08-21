<template>
    <Teleport to="#left-actions">
        <v-btn @click.prevent="$router.push(url)" variant="plain" :color="$vuetify.theme.name === 'light' ? 'primary' : 'white'" prepend-icon="mdi-chevron-left">{{ $t('system.back') }}</v-btn>
    </Teleport>
</template>

<script setup>

defineProps({
    url: {
        default: ''
    }
});
</script>
