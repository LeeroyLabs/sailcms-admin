<template>
    <template v-if="isReady">
        <Teleport to="#actions">
            <div class="tw-flex tw-flex-row tw-gap-x-2">
                <template v-for="action in availableActions">
                    <v-btn @click.prevent="performAction(action)" :color="action.color" v-if="hasPermission(action.permission)">
                        {{ action.label[$i18n.locale] }}
                    </v-btn>
                </template>
            </div>
        </Teleport>
        <div id="test" class="tw-absolute tw-w-[calc(100%-3rem)]" :class="{'tw-h-[calc(100%-4.5rem)]': availableActions.length === 0, 'tw-h-[calc(100%-6.5rem)]': availableActions.length > 0}">
            <iframe
                ref="iframe"
                id="extension-ui"
                class="tw-block tw-w-full tw-min-h-[calc(100%-100px)]"
                :class="{'tw-invisible': showLoader}"
                :src="urlSrc"
                allowtransparency="true"
                referrerpolicy="no-referrer"
                sandbox="allow-forms allow-scripts">
            </iframe>
        </div>
    </template>
    <Loader v-if="!isReady || showLoader"/>
    <h1 v-if="isError && isReady" class="tw-pt-60 tw-text-2xl tw-text-center">Cannot find any registered content for this URL.</h1>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/app';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import Loader from '@/components/globals/Loader.vue';
import { hasPermission } from '@/libs/tools';
import { Misc, SailCMS } from '@/libs/graphql';
import { Extensions } from '@/libs/extensions';
import { useTheme } from 'vuetify';
import { useI18n } from 'vue-i18n';
import { usePage } from '@/libs/page';

const route = useRoute();
const router = useRouter();
const store = useAppStore();
const theme = useTheme();
const i18n = useI18n();
const page = usePage();

const isReady = ref(false);
const showLoader = ref(false);
const isError = ref(false);
let conf = store.getCurrentThirdPartyUI(route);
const urlSrc = ref('');
const iframe = ref(null);
const availableActions = ref([]);

const UIBridge = new Extensions(async (message, data) =>
{
    // Deny anything if connection is not properly established
    if (!Extensions.established()) return;

    let result;

    switch (message)
    {
        case 'hasPermission':
            UIBridge.respond('hasPermission', hasPermission(data.permission));
            break;

        case 'setPageTitle':
            page.setPageTitle(data.title);
            break;

        case 'setReadyState':
            showLoader.value = !data.state;
            break;

        case 'addActionButton':
            availableActions.value.push(data);
            break;

        case 'runGraphQLQuery':
            result = await Misc.runExtensionQuery(data.name, data.query, data.variables, SailCMS.getLocales());
            UIBridge.respond('queryResult', {query: data.id, result: result});
            break;

        case 'runGraphQLMutation':
            result = await Misc.runExtensionMutation(data.name, data.query, data.variables, SailCMS.getLocales());
            UIBridge.respond('mutationResult', {query: data.id, result: result});
            break;

        case 'redirect':
            let path = '';

            if (data.location.substring(0, 1) !== '/') {
                let url = new URL(data.location);
                path = url.pathname.slice(url.pathname.lastIndexOf("/")+1);
            } else {
                path = data.location;
            }

            await router.push(path);
            break;
    }
}, {theme: theme.name.value, locale: i18n.locale.value, user: store.currentUser});

window.sailcms = {showLoader: false};

onMounted(async () =>
{
    // Get the handshake key
    const handshakeKey = await Misc.handshakeKey();
    showLoader.value = true;
    isReady.value = true;

    if (route.meta.settings) {
        // Different Configs
        conf = store.getCurrentThirdPartySettingsUI(route);
    }

    await nextTick(() =>
    {
        if (route.meta.settings) {
            urlSrc.value = SailCMS.getURL().replace('graphql', 'extension/' + conf.name + '/settings')
        } else {
            urlSrc.value = SailCMS.getURL().replace('graphql', 'extension/' + conf.name + '/ui')
        }

        iframe.value.onload = () =>
        {
            UIBridge.handshake(iframe.value, handshakeKey);
        }
    });
});

// Locale Change
watch(i18n.locale, (value) =>
{
    UIBridge.respond('localeChange', {locale: value});
});

// Theme Change
watch(theme.name, (value) =>
{
    UIBridge.respond('themeChange', {theme: value});
});

const performAction = (action) =>
{
    UIBridge.respond('actionPerformed', action.id);
}

if (conf) {
    if (!hasPermission(conf.permission)) {
        router.push({name: 'Dashboard'});
    }
} else {
    isError.value = true;
    isReady.value = true;
}

</script>
