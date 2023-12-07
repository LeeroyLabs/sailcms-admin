<script>
</script>

<div class="bookmark-bar">
    <a href="">Bookmark 1</a>
    <a href="">Bookmark 2</a>
    <a href="">Bookmark 3</a>
    <a href="">Bookmark 4</a>
    <a href="">Bookmark 5</a>
    <a href="">Bookmark 6</a>
</div>

<style lang="scss">
    .bookmark-bar {
        @apply bg-gray-100 dark:bg-surface-500 px-4 py-1.5 border-b border-surface-300 dark:border-neutral-900;
        @apply flex flex-row gap-x-4;

        a {
            @apply hover:text-primary-500;
        }
    }
</style>