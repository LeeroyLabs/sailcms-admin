<template>
    <div v-if="isReady" class="tw-px-6 tw-py-4">
        <v-form ref="form">
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-6 tw-gap-y-2">
                <div class="tw-col-span-2 tw-grid lg:tw-grid-cols-2 tw-gap-6 tw-mb-6">
                    <v-text-field
                        color="primary"
                        :label="$t('email.name')"
                        variant="outlined"
                        type="email"
                        :rules="[rules.required]"
                        validate-on="blur"
                        v-model="currentEmail.name"
                        density="comfortable"
                        class="tw-full"
                        :hide-details="true"
                    />

                    <v-select
                        v-model="selectedTemplate"
                        label="Template"
                        color="primary"
                        :items="availableTemplates"
                        variant="outlined"
                        density="comfortable"
                        placeholder="Template"
                        :persistent-hint="true"
                        :hide-details="true"
                        class="tw-w-full"
                    ></v-select>
                </div>

                <v-text-field
                    v-for="(locale, idx) in SailCMS.getLocales()"
                    color="primary"
                    :label="$t('email.subject', {locale: locale})"
                    variant="outlined"
                    type="email"
                    :rules="[rules.required]"
                    validate-on="blur"
                    v-model="currentEmail.subject[locale]"
                    density="comfortable"
                    :class="{'tw-col-span-2': idx > 1 && idx+1 === SailCMS.getLocales().length}"
                />
            </div>

            <div v-if="selectedTemplate" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-x-6 tw-gap-y-2">
                <template v-for="(field, index) in selectedTemplate.configs">
                    <template v-if="['text', 'cta', 'cta_title'].includes(field.type)">
                        <h2 class="tw-col-span-2 tw-font-medium tw-mb-2">{{ field.label[$i18n.locale] }}</h2>
                        <v-text-field
                            v-for="(locale, idx) in SailCMS.getLocales()"
                            color="primary"
                            :label="field.label[$i18n.locale] + ' (' + locale + ')'"
                            variant="outlined"
                            type="email"
                            :rules="[rules.required]"
                            validate-on="blur"
                            v-model="fields[index].value[locale]"
                            density="comfortable"
                            :class="{'tw-col-span-2': idx > 1 && idx+1 === SailCMS.getLocales().length}"
                        />
                    </template>

                    <template v-if="field.type === 'content'">
                        <div v-for="(locale, idx) in SailCMS.getLocales()" class="tw-mb-4">
                            <h2 class="tw-col-span-2 tw-font-medium tw-mb-2">{{ field.label[$i18n.locale] }} ({{ locale }})</h2>
                            <Editor
                                @change="(e) => fields[index].value[locale] = e"
                                :content="fields[index].value[locale]"
                                :class="{'tw-col-span-2': idx > 1 && idx+1 === SailCMS.getLocales().length}"
                            />
                            <small v-html="$t('email.content_note').replace('[[', '{{').replace(']]', '}}')"></small>
                        </div>
                    </template>
                </template>
            </div>

            <div v-if="selectedTemplate" class="tw-mt-6 tw-flex tw-flex-row tw-gap-x-2">
                <v-btn @click.prevent="saveEmail" :loading="isLoading" variant="flat" color="primary">{{ $t('system.save') }}</v-btn>
                <v-btn @click.prevent="previewEmail" :loading="isPreviewing" variant="flat" color="success">{{ $t('email.preview') }}</v-btn>
                <v-btn @click.prevent="$router.push({name: 'Emails'})" variant="flat">{{ $t('system.cancel') }}</v-btn>
            </div>
        </v-form>

        <Transition>
            <div v-if="showPreview" class="tw-fixed tw-inset-0 tw-bg-black/40 tw-z-[999] tw-flex tw-flex-row tw-justify-end"></div>
        </Transition>

        <div
            class="tw-fixed tw-top-0 tw-bottom-0 tw-z-[9999] tw-border-l tw-w-full lg:tw-w-[80%] tw-h-full tw-flex tw-flex-col tw-items-center tw-transition-all tw-duration-[0.75s] tw-delay-300 tw-ease-in-out"
            :class="{
                'tw-bg-gray-200 tw-border-gray-400': $vuetify.theme.name === 'light',
                'tw-bg-neutral-900 tw-border-neutral-700': $vuetify.theme.name === 'dark',
                'tw-right-[-100%]': !showPreview,
                'tw-right-0': showPreview
            }"
        >
            <v-btn @click.prevent="destroyPreview" class="tw-absolute tw-right-4 tw-top-2" icon="mdi-close"></v-btn>
            <div class="tw-h-[100px] tw-text-black tw-px-6 tw-flex tw-flex-row tw-items-center tw-justify-center tw-gap-x-4">
                <v-btn @click.prevent="activeSize='desktop'" variant="flat" :color="activeSize === 'desktop' ? 'info' : 'primary'" class="!tw-h-[50px]">
                    <v-icon icon="mdi-monitor" class="tw-mr-2"/>
                    {{ $t('email.previewer.desktop') }}
                </v-btn>
                <v-btn @click.prevent="activeSize='mobile'" variant="flat" :color="activeSize === 'mobile' ? 'info' : 'primary'" class="!tw-h-[50px]">
                    <v-icon icon="mdi-cellphone" class="tw-mr-2"/>
                    {{ $t('email.previewer.mobile') }}
                </v-btn>
            </div>
            <iframe id="previewer" class="tw-transition-all tw-duration-300 tw-h-[calc(100%-125px)] tw-rounded-lg" :class="{'tw-w-11/12': activeSize === 'desktop', 'tw-w-[290px]': activeSize === 'mobile'}"></iframe>
        </div>
    </div>
    <Loader v-else/>
</template>

<script setup>
import { usePage } from '@/libs/page';
import { useRoute, useRouter } from 'vue-router';
import { nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Loader from '@/components/globals/Loader.vue';
import { Emails, SailCMS } from '@/libs/graphql';
import Editor from '@/components/globals/Editor.vue';
import { useAppStore } from '@/store/app';
import { cloneDeep } from 'lodash';
import Joi from 'joi';
import { tlds } from '@hapi/tlds';

const page = usePage();
const route = useRoute();
const router = useRouter();
const i18n = useI18n();
const store = useAppStore();

const isReady = ref(false);
const isLoading = ref(false);
const isPreviewing = ref(false);
const form = ref(null);
const iframe = ref(null);
const activeSize = ref('desktop');

const selectedTemplate = ref(null);

const showPreview = ref(false);
const showPreviewBox = ref(false);

const rules = {
    required: value => !!value || i18n.t('login.errors.required'),
    email: value => {
        const schema = Joi.object({
            email: Joi.string().email({minDomainSegments: 2, tlds: {allow: tlds}}),
        });

        const result = schema.validate({email: value});
        return !result.error || i18n.t('login.errors.invalid_email');
    }
};

const availableTemplates = ref([]);
const fields = ref([]);
const currentEmail = ref({
    _id: '',
    name: '',
    slug: '',
    subject: {fr: '', en: ''},
    fields: [],
    template: null,
    created_at: 0,
    last_modified: 0,
    site_id: '',
    is_preview: false
});

watch(selectedTemplate, (v) =>
{
    let configs = [];

    if (!v) return;

    for (let field of v.configs) {
        let values = {};
        let current = currentEmail.value.fields.find(f => f.key === field.key);

        if (route.params.id !== 'add') {
            // Apply the values from the current email
            if (current) {
                values = current.value;
            } else {
                for (let locale of SailCMS.getLocales()) {
                    values[locale] = '';
                }
            }
        } else {
            for (let locale of SailCMS.getLocales()) {
                values[locale] = '';
            }
        }

        configs.push({
            key: field.key,
            value: values
        });
    }

    fields.value = configs;
});

const loadTemplates = async () =>
{
    const templates = await Emails.emailTemplates(SailCMS.getLocales());

    availableTemplates.value = templates.map(item => {
        return {value: item, title: item.name};
    });

    if (route.params.id === 'add') {
        isReady.value = true;
    }
}

const loadEmail = async () =>
{
    currentEmail.value = await Emails.email(route.params.id, SailCMS.getLocales());

    //fields.value = currentEmail.value.fields;
    let tpl = availableTemplates.value.find(tpl => tpl.title === currentEmail.value.template);
    selectedTemplate.value = tpl.value;

    page.setPageTitle(currentEmail.value.name);
    isReady.value = true;
}

const saveEmail = async () =>
{
    currentEmail.value.fields = fields.value;
    currentEmail.value.template = selectedTemplate.value.name;

    if (isLoading.value) return;
    const status = await form.value.validate();
    if (!status.valid) return;

    isLoading.value = true;
    let result;

    if (route.params.id === 'add') {
        result = await Emails.createEmail(currentEmail.value);
    } else {
        result = await Emails.updateEmail(currentEmail.value);
    }

    if (result) {
        store.displayToast('success', i18n.t('email.messages.success'));
        await router.push({ name: 'Emails' });
        return;
    } else {
        store.displayToast('error', i18n.t('email.messages.error'));
    }

    isLoading.value = false;
}

const previewEmail = async () =>
{
    if (isPreviewing.value) return;

    isPreviewing.value = true;
    let result;

    const copy = cloneDeep(currentEmail.value);
    copy.name = selectedTemplate.value.name + '_preview';
    copy.is_preview = true;

    copy.fields = cloneDeep(fields.value);

    let slug = await Emails.createPreviewEmail(copy);
    isPreviewing.value = false;

    if (slug === '') {
        store.displayToast('error', 'Could not load preview');
        return;
    }

    // Open previewer
    showPreview.value = true;
    showPreviewBox.value = true;

    // Load previewer page
    await nextTick(() =>
    {
        const defaultLocale = SailCMS.getLocales()[0];

        document.getElementById('previewer').setAttribute(
            'src',
            SailCMS.url.replace('/graphql', '/email-preview/' + slug + '/' + defaultLocale)
        );
    });
}

const destroyPreview = async () =>
{
    showPreview.value = false;

    setTimeout(() =>
    {
        activeSize.value = 'desktop';
        document.getElementById('previewer').setAttribute('src', '');
    }, 800);
}

loadTemplates();

if (route.params.id === 'add') {
    page.setPageTitle('email.add');
} else {
    loadEmail();
}
</script>
