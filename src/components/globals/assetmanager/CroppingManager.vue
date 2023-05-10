<template>
    <div class="tw-flex-grow tw-max-h-[calc(100%-72px)]">
        <div class="tw-flex tw-flex-col tw-h-full tw-max-h-full">
            <div class="tw-flex tw-flex-row tw-max-h-full tw-h-full tw-w-full tw-relative">
                <div class="
                    tw-absolute tw-bg-gray-800/60 tw-rounded-lg tw-border tw-border-gray-800 tw-p-4 tw-z-[9000]
                    tw-flex tw-gap-2 tw-left-4

                    tw-flex-row tw-flex-wrap tw-top-2
                    lg:tw-flex-col lg:tw-max-w-full lg:tw-top-[30%]
                ">
                    <div @click.prevent="activeMode='square'" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer" :class="{'tw-bg-gray-600': activeMode === 'square'}">
                        <v-icon color="white" icon="mdi-square-outline"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Square Crop</v-tooltip>
                    </div>
                    <div @click.prevent="activeMode='circle'" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer" :class="{'tw-bg-gray-600': activeMode === 'circle'}">
                        <v-icon color="white" icon="mdi-circle-outline"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Circle Crop</v-tooltip>
                    </div>
                    <div @click.prevent="rotateLeft" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer">
                        <v-icon color="white" icon="mdi-restore"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Rotate Left</v-tooltip>
                    </div>
                    <div @click.prevent="rotateRight" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer">
                        <v-icon color="white" icon="mdi-refresh"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Rotate Right</v-tooltip>
                    </div>

                    <div @click.prevent="flipVertical" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer">
                        <v-icon color="white" icon="mdi-flip-vertical"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Flip Vertical</v-tooltip>
                    </div>
                    <div @click.prevent="flipHorizontal" class="tw-border tw-border-gray-600 hover:tw-bg-gray-600 rounded-lg tw-p-2 tw-cursor-pointer">
                        <v-icon color="white" icon="mdi-flip-horizontal"/>
                        <v-tooltip activator="parent" open-delay="1000" location="right">Flip Horizontal</v-tooltip>
                    </div>
                </div>
                <Cropper
                    ref="cropper"
                    src="https://voxatl.org/wp-content/uploads/2019/04/avengers-endgame-poster-square-crop.jpg"
                    :stencilComponent="activeMode === 'circle' ? CircleStencil : RectangleStencil"
                    @change="handleResize"
                    :minWidth="settings.min.width"
                    :maxWidth="settings.max.width"
                    :minHeight="settings.min.height"
                    :maxHeight="settings.max.height"
                    image-restrictions="stencil"
                    :stencil-props="{
                        aspectRatio: settings.ratio
                    }"
                />
                <div
                    v-if="previewImage && !$vuetify.display.mobile"
                    class="tw-absolute
                      tw-bottom-8 tw-right-8 tw-w-[150px] tw-h-[150px] tw-bg-black tw-border
                      tw-flex tw-flex-row tw-items-center tw-justify-center tw-bg-center tw-bg-cover
                    "
                    :class="{'tw-rounded-full': activeMode === 'circle', 'tw-rounded-lg': activeMode !== 'circle'}"
                    :style="'background-image: url(' + previewImage + ')'"
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { CircleStencil, RectangleStencil, Cropper, PreviewResult } from "vue-advanced-cropper";
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.compact.css';
import { ref } from "vue";

const props = defineProps({
    settings: {
        type: Object,
        default: {ratio: '', min: { width: 0, height: 0 }, max: {width: 0, height: 0}, lockedType: ''}
    }
});

console.log(props.settings);

const activeMode = ref('square');
const previewer = ref(null);
const previewImage = ref(null);
const cropper = ref(null);

const handleResize = (e) =>
{
    e.canvas.toBlob((blob) => {
        // @ts-ignore
        const reader = new FileReader();
        reader.onloadend = () => {
            previewImage.value = reader.result;
        }
        reader.readAsDataURL(blob);
    }, 'image/webp');
    console.log(e);
}

const rotateLeft = () => cropper.value.rotate(-90);
const rotateRight = () => cropper.value.rotate(90);
const flipHorizontal = () => cropper.value.flip(1,0);
const flipVertical = () => cropper.value.flip(0,1);

</script>

<style>
.vue-advanced-cropper {
    width: 100%;
}
</style>
