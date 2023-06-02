<template>
    <div class="tw-flex-grow tw-max-h-[calc(100%-72px)]">
        <div
            v-if="savingCrop"
            class="tw-absolute tw-bg-black/50 tw-inset-0 tw-z-[9999] tw-flex tw-flex-row tw-items-center tw-justify-center"
        >
            <v-progress-circular indeterminate size="200" width="6" />
        </div>
        <div class="tw-flex tw-flex-col tw-h-full tw-max-h-full">
            <div
                class="tw-flex tw-flex-row tw-max-h-full tw-h-full tw-w-full tw-relative"
            >
                <div
                    class="tw-absolute tw-bg-gray-800/60 tw-rounded-lg tw-border tw-border-gray-800 tw-p-4 tw-z-[9000] tw-flex tw-gap-2 tw-left-4 tw-flex-row tw-flex-wrap tw-top-2 lg:tw-flex-col lg:tw-max-w-full lg:tw-top-4"
                >
                    <div
                        @click.prevent="activeMode = 'square'"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                        :class="{
                            'tw-bg-gray-600': activeMode === 'square',
                            'tw-pointer-events-none tw-opacity-30':
                                settings.lockedType === 'circle',
                        }"
                    >
                        <v-icon color="white" icon="mdi-square-outline" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.square") }}</v-tooltip
                        >
                    </div>
                    <div
                        @click.prevent="activeMode = 'circle'"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                        :class="{
                            'tw-bg-gray-600': activeMode === 'circle',
                            'tw-opacity-30': settings.lockedType === 'square',
                        }"
                    >
                        <v-icon color="white" icon="mdi-circle-outline" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.circle") }}</v-tooltip
                        >
                    </div>
                    <div
                        @click.prevent="rotateLeft"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-restore" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.rotate_left") }}</v-tooltip
                        >
                    </div>
                    <div
                        @click.prevent="rotateRight"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-refresh" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.rotate_right") }}</v-tooltip
                        >
                    </div>

                    <div
                        @click.prevent="flipVertical"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-flip-vertical" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.flip_vertical") }}</v-tooltip
                        >
                    </div>
                    <div
                        @click.prevent="flipHorizontal"
                        class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-flip-horizontal" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{
                                $t("assets.cropper.flip_horizontal")
                            }}</v-tooltip
                        >
                    </div>

                    <div
                        class="tw-border tw-hidden md:tw-block tw-my-2 tw-border-gray-700"
                    ></div>

                    <div
                        @click.prevent="saveAndClose"
                        class="tw-hidden md:tw-block tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-check-circle-outline" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.cropper.save_close") }}</v-tooltip
                        >
                    </div>

                    <div
                        @click.prevent="$emit('close')"
                        class="tw-hidden md:tw-block tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer"
                    >
                        <v-icon color="white" icon="mdi-close-circle-outline" />
                        <v-tooltip
                            activator="parent"
                            open-delay="1000"
                            location="right"
                            >{{ $t("assets.assets.cancel") }}</v-tooltip
                        >
                    </div>
                </div>
                <Cropper
                    ref="cropper"
                    :src="file.url"
                    :stencilComponent="
                        activeMode === 'circle'
                            ? CircleStencil
                            : RectangleStencil
                    "
                    @change="handleResize"
                    :minWidth="settings.min.width"
                    :maxWidth="settings.max.width"
                    :minHeight="settings.min.height"
                    :maxHeight="settings.max.height"
                    :stencil-props="{
                        aspectRatio: settings.ratio,
                    }"
                />
                <div
                    v-if="previewImage && !$vuetify.display.mobile"
                    class="tw-absolute tw-bottom-8 tw-right-8 tw-w-[150px] tw-h-[150px] tw-bg-black tw-border tw-flex tw-flex-row tw-items-center tw-justify-center tw-bg-center tw-bg-cover"
                    :class="{
                        'tw-rounded-full': activeMode === 'circle',
                        'tw-rounded-lg': activeMode !== 'circle',
                    }"
                    :style="'background-image: url(' + previewImage + ')'"
                ></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    CircleStencil,
    RectangleStencil,
    Cropper,
    PreviewResult,
} from "vue-advanced-cropper";
import "vue-advanced-cropper/dist/style.css";
import "vue-advanced-cropper/dist/theme.compact.css";
import { ref } from "vue";
import { useAppStore } from "@/store/app";
import { Assets } from "@/libs/graphql";

const props = defineProps({
    settings: {
        type: Object,
        default: {
            name: "",
            ratio: "",
            min: { width: 0, height: 0 },
            max: { width: 0, height: 0 },
            lockedType: "",
        },
    },
    file: {
        type: Object,
        default: null,
    },
});

const emitter = defineEmits(["close", "generated"]);

const activeMode = ref(
    props.settings.lockedType !== "circle" ? "square" : "circle"
);
const previewImage = ref(null);
const cropper = ref(null);
const store = useAppStore();

const cropName = ref(props.settings.name);
const currentCrop = ref("");
const savingCrop = ref(false);

const handleResize = (e) => {
    e.canvas.toBlob((blob) => {
        // @ts-ignore
        const reader = new FileReader();
        reader.onloadend = async () => {
            let img = new Image();
            img.src = reader.result;
            await img.decode();

            if (props.settings.name === "") {
                cropName.value = img.width + "x" + img.height;
            }

            previewImage.value = reader.result;
            currentCrop.value = reader.result.split("base64,")[1];
        };
        reader.readAsDataURL(blob);
    }, "image/webp");
};

// Save crop
const saveAndClose = async () => {
    savingCrop.value = true;
    await Assets.createTransform(
        props.file._id,
        cropName.value,
        currentCrop.value
    );
    savingCrop.value = false;
    emitter("generated");
};

const rotateLeft = () => cropper.value.rotate(-90);
const rotateRight = () => cropper.value.rotate(90);
const flipHorizontal = () => cropper.value.flip(1, 0);
const flipVertical = () => cropper.value.flip(0, 1);
</script>

<style>
.vue-advanced-cropper {
    width: 100%;
}
</style>
