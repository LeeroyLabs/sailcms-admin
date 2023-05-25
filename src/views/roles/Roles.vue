<template>
    <div v-if="isReady">
        <Teleport to="#actions">
            <v-btn @click="$router.push({name: 'SingleRole', params: {id: 'add'}})" color="primary" v-if="hasPermission('readwrite_role')">
                {{ $t('roles.add') }}
            </v-btn>
        </Teleport>

        <div v-if="roles.length > 0" class="tw-mt-8 tw-flex tw-flex-row tw-flex-wrap tw-gap-6 tw-w-full">
            <v-card v-for="role in roles" variant="tonal" class="tw-group tw-p-6 tw-flex tw-flex-col tw-min-h-[130px] tw-min-w-[335px] tw-max-w-[335px]">
                <h2 class="tw-text-lg">{{ role.name }}</h2>
                <small class="tw-text-sm">
                    {{ role.description }}
                </small>
                <small class="tw-mt-4"><strong>{{ role.member_count }}</strong> members</small>

                <div class="tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center tw-absolute tw-inset-0 bg-primary-darker-60">
                    <v-btn @click.prevent="editRole(role._id)" variant="flat" icon color="primary" class="tw-mr-2">
                        <v-icon icon="mdi-pen"/>
                    </v-btn>
                    <v-btn @click="confirmDelete(group)" variant="flat" icon color="red">
                        <v-icon icon="mdi-trash-can"/>
                    </v-btn>
                </div>
            </v-card>
        </div>

        <div v-if="roles.length === 0" class="tw-text-2xl tw-w-full tw-text-center tw-mt-48">
            {{ $t('roles.no_roles') }}
        </div>
    </div>
    <Loader v-else/>

    <Transition>
        <DeleteConfirmation
            v-if="showDeleteConfirm"
            :show="true"
            :overall="true"
            :loading="isLoading"
            :title="$t('usergroups.confirm')"
            :message="$t('usergroups.confirm_delete', {group: (currentGroup) ? currentGroup.name : ''})"
            @cancel="showDeleteConfirm=false"
            @accept="deleteGroup"
        />
    </Transition>
</template>

<script setup>

import { usePage } from '@/libs/page';
import { hasPermission } from '@/libs/tools';
import Loader from '@/components/globals/Loader.vue';
import DeleteConfirmation from '@/components/globals/DeleteConfirmation.vue';
import { ref } from 'vue';
import { Roles } from '@/libs/graphql';
import { useRouter } from 'vue-router';

const router = useRouter();
const isReady = ref(false);
const showDeleteConfirm = ref(false);
const isLoading = ref(false);
const roles = ref([]);

const page = usePage();
page.setPageTitle('roles.title');

const loadRoles = async () =>
{
    roles.value = await Roles.roles();
    isReady.value = true;
}

const editRole = (id) => router.push({name: 'SingleRole', params: {id: id}});

loadRoles();

</script>
