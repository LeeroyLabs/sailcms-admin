<template>
    <div class="tw-hidden tw-mx-2 lg:tw-flex tw-flex-row tw-min-h-[450px]" v-if="isReady">
        <div class="tw-w-3/12 xl:tw-w-[250px] tw-mr-4">
            <h2 class="tw-text-xl tw-mb-4 tw-font-medium">{{ $t('extensions.containers') }}</h2>
            <a
                v-for="(container, idx) in extensions.containers"
                class="tw-block tw-ml-4 tw-py-2 hover:tw-text-primary hover:tw-underline"
                :class="{'!tw-text-primary': selectedExtension && selectedExtension.info.name === container.info.name}"
                href=""
                @click.prevent="showExtension('container', idx)"
            >
                {{ container.info.name }}
            </a>
            <h2 class="tw-text-xl tw-my-4 tw-font-medium">Modules</h2>
            <a
                v-for="(module, idx) in extensions.modules"
                class="tw-block tw-ml-4 tw-py-2 hover:tw-text-primary hover:tw-underline"
                href=""
                @click.prevent="showExtension('module', idx)"
            >
                {{ module.info.name }}
            </a>
        </div>
        <v-divider :thickness="2" vertical :class="{'!tw-border-gray-400': $vuetify.theme.name === 'light'}"></v-divider>
        <div class="tw-ml-8 tw-flex-grow">
            <div
                v-if="!selectedExtension"
                class="tw-text-center tw-text-lg tw-font-medium tw-flex tw-flex-row tw-h-full tw-items-center tw-justify-center"
            >
                {{ $t('extensions.select_ext') }}
            </div>
            <div v-else>
                <h1 class="tw-text-2xl">
                    {{ selectedExtension.info.name }}
                    <v-chip color="success" v-if="selectedExtension.class.includes('Leeroy\\')">
                        {{ $t('extensions.official') }}
                    </v-chip>
                </h1>
                <p class="tw-px-0.5 tw-mt-1 tw-mb-2 tw-text-sm">
                    {{ selectedExtension.info.description }} &mdash;
                    {{ selectedExtension.info.author }} &mdash;
                    {{ selectedExtension.info.semver }} &mdash;
                    <a :href="selectedExtension.info.link" target="_blank" class="hover:tw-underline">Website</a>
                </p>

                <div v-if="selectedExtension.routes">
                    <h2 class="tw-text-xl tw-mt-12 tw-mb-2">Routes</h2>
                    <v-divider :thickness="2" :class="{'!tw-border-gray-400': $vuetify.theme.name === 'light'}"/>
                    <div v-if="providedRoutesCount === 0" class="tw-mt-8">
                        {{ $t('extensions.no_routes') }}
                    </div>
                    <div v-else>
                        <div v-for="route in selectedExtension.routes.get">
                            <v-chip class="ma-2" color="blue" label>GET</v-chip>
                            {{ route }}
                        </div>
                        <div v-for="route in selectedExtension.routes.post">
                            <v-chip class="ma-2" color="green" label>POST</v-chip>
                            {{ route }}
                        </div>
                        <div v-for="route in selectedExtension.routes.put">
                            <v-chip class="ma-2" color="blue" label>PUT</v-chip>
                            {{ route }}
                        </div>
                        <div v-for="route in selectedExtension.routes.delete">
                            <v-chip class="ma-2" color="red" label>DELETE</v-chip>
                            {{ route }}
                        </div>
                    </div>

                    <h2 class="tw-text-xl tw-mt-12 tw-mb-2">GraphQL</h2>
                    <v-divider :thickness="2" :class="{'!tw-border-gray-400': $vuetify.theme.name === 'light'}"/>
                    <div class="tw-mt-8" v-if="providedGQQLCount === 0">
                        {{ $t('extensions.no_gql') }}
                    </div>
                    <div v-else>
                        <div v-for="q in selectedExtension.graphql.queries">
                            <v-chip class="ma-2" color="blue" label>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-arrow-left" size="x-small" class="tw-mr-2"></v-icon>
                                </template>
                                Query
                            </v-chip>
                            <span class="tw-font-medium">{{ q.operation }}</span> using <span class="tw-font-medium">{{ q.handler }}</span>
                        </div>
                        <div v-for="m in selectedExtension.graphql.mutations">
                            <v-chip class="ma-2" color="green" label>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-arrow-right" size="x-small" class="tw-mr-2"></v-icon>
                                </template>
                                Mutation
                            </v-chip>
                            <span class="tw-font-medium">{{ m.operation }}</span> using <span class="tw-font-medium">{{ m.handler }}</span>
                        </div>
                        <div v-for="r in selectedExtension.graphql.resolver">
                            <v-chip class="ma-2" color="orange" label>
                                <template v-slot:prepend>
                                    <v-icon icon="mdi-check" size="x-small" class="tw-mr-2"></v-icon>
                                </template>
                                Resolver
                            </v-chip>
                            <span class="tw-font-medium">{{ r.operation }}</span> using <span class="tw-font-medium">{{ r.handler }}</span>
                        </div>
                    </div>
                </div>

                <h2 class="tw-text-xl tw-mt-12 tw-mb-2">Middleware</h2>
                <v-divider :thickness="2" :class="{'!tw-border-gray-400': $vuetify.theme.name === 'light'}"/>
                <div class="tw-mt-8">
                    {{ $t('extensions.no_middleware') }}
                </div>
            </div>
        </div>
    </div>
    <div v-else>
        <Loader/>
    </div>
    <div class="lg:tw-hidden tw-text-center tw-mt-24 tw-text-lg tw-font-medium">
        {{ $t('extensions.mobile_message') }}
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useAppStore } from "@/store/app";
import { Misc } from "@/libs/graphql";
import Loader from "@/components/globals/Loader.vue";
import { usePage } from "@/libs/page";

const store = useAppStore();

const extensions = ref({modules: [], containers: []});
const selectedExtension = ref(null);

const isReady = ref(false);

const providedRoutesCount = computed(() =>
{
    if (!selectedExtension.value) return 0;

    const del = selectedExtension.value.routes.delete.length;
    const get = selectedExtension.value.routes.get.length;
    const post = selectedExtension.value.routes.post.length;
    const put = selectedExtension.value.routes.put.length;
    const redirect = selectedExtension.value.routes.redirect.length;

    return del+get+post+put+redirect;
});

const providedGQQLCount = computed(() =>
{
    const q = selectedExtension.value.graphql.queries.length;
    const m = selectedExtension.value.graphql.mutations.length;
    const r = selectedExtension.value.graphql.resolvers.length;

    return q+m+r;
});

const page = usePage();
page.setPageTitle('Extensions');
page.setBreadcrumbs([{title: 'Extensions', disable: true, to: ''}]);

const loadExtensions = async () =>
{
    extensions.value = await Misc.registeredExtensions();
    isReady.value = true;
};

const showExtension = (type, index) =>
{
    if (type === 'container') {
        // @ts-ignore
        selectedExtension.value = extensions.value.containers[index];
        return;
    }

    // @ts-ignore
    selectedExtension.value = extensions.value.modules[index];
}

loadExtensions();
</script>
