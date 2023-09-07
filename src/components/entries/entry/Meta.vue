 <template>
     <div>
         <TabBar :tabs="tabNames" :active="tab" :smallText="true" :locked="[1]" :stretch="true" @change="(e) => tab=e"/>
         <div class="panel" :class="{'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
             <div class="panelinfo" v-if="tab === 0">
                 <div>
                     <h2>{{ $t('entry.slug') }}</h2>
                     <p>{{ entry.slug || $t('entry.na') }}</p>
                 </div>
                 <div class="tw-mt-4">
                     <Search v-model="entry.parent" :type="entry.entry_type" @change="(e) => $emit('parentChange', e)" />
                 </div>
                 <div class="tw-mt-4">
                     <v-select
                         :label="$t('entry.template')"
                         :hide-details="true"
                         v-model="template"
                         color="primary"
                         :items="templates"
                         variant="outlined"
                         density="comfortable"
                         :persistent-hint="false"
                         class="tw-w-full"
                         @update:modelValue="(e) => $emit('templateChange', e)"
                     />
                 </div>
             </div>

             <div class="panelinfo" v-if="entry._id !== '' && tab === 1">
                 <div>
                     <h2>ID</h2>
                     <p v-if="entry._id !== ''">

                     </p>
                     <p v-else>
                         {{ $t('entry.not_available_yet') }}
                     </p>
                 </div>
                 <div>
                     <h2>{{ $t('entry.created_at') }}</h2>
                     <p v-if="entry._id !== ''">
                         dd-mm-yyyy h:i by Bob Jones
                     </p>
                     <p v-else>
                         {{ $t('entry.not_available_yet') }}
                     </p>
                 </div>
                 <div>
                     <h2>{{ $t('entry.last_mod') }}</h2>
                     <p v-if="entry._id !== ''">
                         dd-mm-yyyy h:i by Bob Jones
                     </p>
                     <p v-else>
                         {{ $t('entry.not_available_yet') }}
                     </p>
                 </div>
             </div>

             <div
                 v-if="tab === 0"
                 class="panel-bottom"
                 :class="{'tw-border-gray-200 tw-bg-gray-50': $vuetify.theme.name === 'light', 'tw-bg-lightdark tw-border-neutral-700': $vuetify.theme.name === 'dark'}"
             >

                 <v-btn v-if="entry._id !== ''" variant="text" color="red">Trash</v-btn>
                 <v-btn @click.prevent="$emit('save')" variant="flat" color="primary">Save</v-btn>
             </div>
         </div>
     </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import TabBar from '@/components/globals/Tab.vue';
import { useI18n } from 'vue-i18n';
import Search from '@/components/entries/entry/tools/Search.vue';

const props = defineProps({
    entry: {
        type: Object,
        default: {slug: '', parent: ''}
    },
    templates: {
        type: Array,
        default: []
    }
});

const emitter = defineEmits(['parentChange', 'templateChange', 'save', 'trash']);

// Use
const i18n = useI18n();

// Variables
const tab = ref(0);

const tabNames = computed(() => {
    return [i18n.t('entry.general'), i18n.t('entry.info')];
});

const template = ref(props.entry.template || props.entry.entry_type || 'default');
</script>

<style lang="postcss">
.panel {
    @apply tw-rounded-md tw-flex tw-flex-col tw-justify-between;
}

.panelinfo {
    @apply tw-p-4 tw-flex tw-flex-col tw-gap-y-2;
}

.panelinfo > div {
    @apply tw-flex tw-flex-col;
}

.panelinfo > div h2 {
    @apply tw-font-medium tw-text-neutral-600;
}

.panelinfo > div p {
    @apply tw-text-neutral-400 tw-text-sm;
}

.panel-bottom {
    @apply tw-mt-0 tw-px-4 tw-py-3 tw-rounded-b-md tw-border-t tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-x-2;
}
</style>
