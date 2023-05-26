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

                <div class="tw-hidden group-hover:tw-flex tw-flex-row tw-items-center tw-justify-center tw-absolute tw-inset-0 tw-bg-black/40">
                    <v-btn @click.prevent="editRole(role._id)" variant="flat" icon color="primary" class="tw-mr-2">
                        <v-icon icon="mdi-pen"/>
                    </v-btn>
                    <v-btn @click="confirmDelete(role)" variant="flat" icon color="red">
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
            :title="$t('roles.confirm')"
            :message="$t('roles.confirm_delete', {role: (currentRole) ? currentRole.name : ''})"
            @cancel="showDeleteConfirm=false"
            @accept="deleteRole"
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
const currentRole = ref(null);
const isLoading = ref(false);
const roles = ref([]);

const page = usePage();
page.setPageTitle('roles.title');

const loadRoles = async () =>
{
    roles.value = await Roles.roles();
    isReady.value = true;
}

const confirmDelete = (role) =>
{
    currentRole.value = role;
    showDeleteConfirm.value = true;
}

const deleteRole = async () =>
{
    isLoading.value = true;
    await Roles.deleteRole(currentRole.value._id);
    await loadRoles();
    isLoading.value = false;
    showDeleteConfirm.value = false;
    currentRole.value = null;
}

const editRole = (id) => router.push({name: 'SingleRole', params: {id: id}});

loadRoles();

</script>
