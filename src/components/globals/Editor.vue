<template>
    <div>
        <textarea :id="'tiny-' + id" class="tinymce">{{ content }}</textarea>
        <template v-if="config.explain && config.explain[$i18n.locale] !== '' && !multi">
            <div class="tw-text-right tw-mt-2 tw-text-sm tw-text-gray-400">
                {{ config.explain[$i18n.locale] }}
            </div>
        </template>
    </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, watch, ref } from 'vue';
import { v4 } from 'uuid';
import { useTheme } from 'vuetify';

const id = v4();
const theme = useTheme();

// Theme Variables
const bgColor = theme.name.value === 'dark' ? '--editor-dark-bg' : '--editor-light-bg';

defineProps({
    content: {
        type: String,
        default: ''
    },
    config: {
        type: Object,
        default: {}
    },
    multi: {
        type: Boolean,
        default: false
    }
});

const emitter = defineEmits(['change']);

onMounted(async () =>
{
    await setupEditor();
    handleTheme();
});

watch(theme.name, async (t) =>
{
    tinymce.get('tiny-' + id).destroy();

    await setupEditor();
    handleTheme();
});

const handleTheme = () =>
{
    if (theme.name.value === 'light') {
        let iframes = document.getElementsByTagName('iframe');

        for (let frame of iframes) {
            frame.contentWindow.document.body.style.backgroundColor = '#ffffff';
        }
    } else {
        let iframes = document.getElementsByTagName('iframe');

        for (let frame of iframes) {
            frame.contentWindow.document.body.style.backgroundColor = '#111111';

            // This is the only way to make the colors work
            document.querySelectorAll('.tox:not(.tox-tinymce-inline) .tox-editor-header').forEach((item) => item.style.backgroundColor = '#354152');
            document.querySelectorAll('.tox .tox-menubar').forEach((item) => item.style.backgroundColor = '#354152');
            document.querySelectorAll('.tox .tox-toolbar, .tox .tox-toolbar__overflow, .tox .tox-toolbar__primary').forEach((item) => item.style.backgroundColor = '#354152');
            document.querySelectorAll('.tox .tox-tbtn--bespoke').forEach((item) => item.style.border = '1px solid #505f80');
            document.querySelectorAll('.tox .tox-toolbar-overlord').forEach((item) => item.style.backgroundColor = '#505f80');
            document.querySelectorAll('.tox .tox-statusbar').forEach((item) => item.style.backgroundColor = '#354152');
            document.querySelectorAll('.tox-tinymce').forEach((item) => item.style.border = '2px solid #354152');
        }
    }
}

const setupEditor = async () =>
{
    await tinymce.init({
        skin: theme.name.value === 'dark' ? "oxide-dark" : 'oxide',
        content_css: theme.name.value === 'dark' ? "dark" : "default",
        selector: '#tiny-' + id,
        plugins: 'anchor autolink charmap codesample emoticons link lists searchreplace table visualblocks wordcount code',
        toolbar: 'undo redo | blocks | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat code',
        menubar: 'edit insert view format table',
        setup: (editor) =>
        {
            editor.on('Paste Change Input Undo Redo Cut', (e) =>
            {
                emitter('change', tinymce.get('tiny-' + id).getContent());
            });
        }
    });
}

onBeforeUnmount(() =>
{
    tinymce.get('tiny-' + id).destroy();
});
</script>

<style>
.tox .tox-menu {
    background-color: var(--editor-light-bg)!important;
}

.dark .tox .tox-menu {
    background-color: var(--editor-dark-bg)!important;
}
</style>
