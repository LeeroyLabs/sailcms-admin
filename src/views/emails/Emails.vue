<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'SingleEmail', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_emails')">
                {{ $t('emails.add') }}
            </v-btn>
        </Teleport>
        <section class="tw-mt-6 tw-mb-4 tw-flex tw-flex-col-reverse md:tw-flex-row tw-justify-between">
           <div class="tw-flex tw-flex-row tw-w-full lg:tw-w-3/12 tw-items-center" v-if="hasPermission('readwrite_emails')">
                <v-select
                    v-model="selectedAction"
                    label="Actions"
                    color="primary"
                    :items="availableActions"
                    variant="outlined"
                    density="comfortable"
                    single-line
                    placeholder="Actions"
                    :persistent-hint="false"
                    :hide-details="true"
                ></v-select>

                <v-btn
                    v-if="hasPermission('readwrite_emails')"
                    :class="{
                        'tw-invisible tw-opacity-0': selectedAction === null,
                        'tw-opacity-100': selectedAction !== null
                    }"
                    class="!tw-hidden md:!tw-block tw-ml-2 tw-transition-opacity tw-duration-300"
                    color="primary"
                    size="small"
                    icon
                    @click.prevent="performAction"
                >
                    <v-icon icon="mdi-chevron-right"/>
                </v-btn>

                <v-progress-circular indeterminate size="x-small" width="2" class="tw-ml-2" :class="{'tw-invisible': !applyingAction}"/>
            </div>
        </section>

        <v-table class="utable">
            <thead>
                <tr>
                    <th class="!tw-min-w-[4px] !tw-max-w-[4px]">
                        <v-checkbox @change="handleCheckAll" color="primary" value="checkall" hide-details></v-checkbox>
                    </th>
                    <th>
                        {{ $t('emails.columns.name') }}
                    </th>
                    <th>
                        {{ $t('emails.columns.template') }}
                    </th>
                    <th>
                        {{ $t('emails.columns.created_at') }}
                    </th>
                    <th>
                        {{ $t('emails.columns.last_mod') }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(email, idx) in emailList" :key="email._id">
                    <td class="!tw-min-w-[4px] !tw-max-w-[4px]">
                        <v-checkbox v-model="selectedEmails" color="primary" :value="email" hide-details></v-checkbox>
                    </td>
                    <td class="tw-w-[40%]">
                        <router-link
                            class="hover:tw-text-primary hover:tw-underline"
                            :class="{'hover:tw-text-white': ($vuetify.theme.name !== 'light')}"
                            :to="{name: 'SingleEmail', params: {id: email._id}}"
                        >
                            {{ email.name }}
                        </router-link>
                    </td>
                    <td>{{ email.template }}</td>
                    <td v-html="format(email.created_at * 1000, 'dd-MM-yyyy')"></td>
                    <td v-html="format(email.last_modified * 1000, 'dd-MM-yyyy')"></td>
                </tr>
                <tr v-if="emailList.length === 0">
                    <td colspan="5" class="tw-text-center tw-font-medium">{{ $t('emails.no_emails') }}</td>
                </tr>
            </tbody>
        </v-table>

        <Transition>
            <DeleteConfirmation
                v-if="showDeleteConfirm"
                :show="true"
                :overall="true"
                :title="$t('users.confirm')"
                :loading="applyingAction"
                :message="$t('emails.confirm_msg')"
                @cancel="showDeleteConfirm=false"
                @accept="confirmDelete"
            />
        </Transition>
    </div>
    <Loader v-else />
</template>

<script setup>
import { usePage } from '@/libs/page';
import { hasPermission, isAdmin } from '@/libs/tools';
import { format } from 'date-fns';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import Loader from '@/components/globals/Loader.vue';
import { ref } from 'vue';
import { Emails, SailCMS } from '@/libs/graphql';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();
const page = usePage();

page.setPageTitle('emails.title');

const isReady = ref(false);
const emailList = ref([]);
const selectedEmails = ref([]);

const showDeleteConfirm = ref(false);
const applyingAction = ref(false);

const selectedAction = ref(null);
const availableActions = ref([
    {value: 'delete', title: i18n.t('system.delete')}
]);

// Handle the "Check All" checkbox
const handleCheckAll = (e) =>
{
    if (e.target.checked) selectedEmails.value = emailList.value;
    if (!e.target.checked) selectedEmails.value = [];
}

const loadEmails = async () =>
{
    emailList.value = await Emails.emails(SailCMS.locales);
    isReady.value = true;
}

const performAction = (e) =>
{
    if (selectedEmails.value.length > 0) {
        showDeleteConfirm.value = true;
    }
}

const confirmDelete = async () =>
{
    if (applyingAction.value) return;

    applyingAction.value = true;
    await Emails.deleteEmails(selectedEmails.value);
    applyingAction.value = false;

    await loadEmails();
}

loadEmails();
</script>

<style lang="postcss">
.utable tr:hover td {
    background-color: rgba(229, 231, 235, 0.20);
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.35s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
