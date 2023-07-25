 <template>
     <div>
         <TabBar :tabs="tabNames" :active="tab" :smallText="true" :stretch="true" @change="(e) => tab=e"/>
         <div class="panel" :class="{'tw-bg-white ': $vuetify.theme.name === 'light', 'tw-bg-darkbg': $vuetify.theme.name === 'dark'}">
             <div class="panel-info" v-if="tab === 0">
                 <div>
                     <h2>Slug</h2>
                     <p>{{ entry.slug || $t('entry.na') }}</p>
                 </div>
                 <div>
                     <h2>Parent</h2>
                     <p>XXXXXXXXXXXXXXXXXXXXXXXX</p>
                 </div>
             </div>

             <div class="panel-info" v-if="tab === 1">
                 <div>
                     <h2>ID</h2>
                     <p>XXXXXXXXXXXXXXXXXXXXXXXX</p>
                 </div>
                 <div>
                     <h2>Created</h2>
                     <p>dd-mm-yyyy h:i by Bob Jones</p>
                 </div>
                 <div>
                     <h2>Last Modification</h2>
                     <p>dd-mm-yyyy h:i by Bob Jones</p>
                 </div>
             </div>

             <div
                 v-if="tab === 0"
                 class="panel-bottom"
                 :class="{'tw-border-gray-200 tw-bg-gray-50': $vuetify.theme.name === 'light', 'tw-bg-lightdark tw-border-neutral-700': $vuetify.theme.name === 'dark'}"
             >

                 <v-btn variant="text" color="red">Trash</v-btn>
                 <v-btn variant="flat" color="primary">Save</v-btn>
             </div>
         </div>
     </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import TabBar from '@/components/globals/Tab.vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    entry: {
        type: Object,
        default: {slug: '', parent: null}
    }
});

// Use
const i18n = useI18n();

// Variables
const tab = ref(0);

const tabNames = computed(() => [i18n.t('entry.general'), i18n.t('entry.info')]);
</script>

<style lang="postcss">
.panel {
    @apply tw-rounded-md tw-flex tw-flex-col tw-justify-between;
}

.panel-info {
    @apply tw-p-4 tw-flex tw-flex-col tw-gap-y-2;
}

.panel-info div {
    @apply tw-flex tw-flex-col;
}

.panel-info div h2 {
    @apply tw-font-medium tw-text-neutral-600;
}

.panel-info div p {
    @apply tw-text-neutral-400 tw-text-sm;
}

.panel-bottom {
    @apply tw-mt-4 tw-px-4 tw-py-3 tw-rounded-b-md tw-border-t tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-x-2;
}
</style>
