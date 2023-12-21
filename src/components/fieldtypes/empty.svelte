<script>
    export let config = {};
    export let type = 'html';

    let internalValue = {};

    $: {
        config = internalValue;
    }
</script>