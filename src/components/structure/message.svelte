<script>
    import { Toast, getToastStore } from '@skeletonlabs/skeleton';
    import { Message } from '@stores/message.js';

    const toastStore = getToastStore();

    $: $Message.show, setMessage();
    $: $toastStore, determineState();

    let isOpen = false;

    const determineState = () =>
    {
        if ($toastStore.length > 0) {
            isOpen = true;
        }

        if ($toastStore.length === 0 && isOpen) {
            isOpen = false;
            Message.set({show: false, message: '', type: 'success'});
        }
    }

    const setMessage = () =>
    {
        if ($Message.show) {
            toastStore.trigger({ message: $Message.message });
        }
    }
</script>

<Toast
    background={($Message.type === 'success') ? 'bg-success-500' : 'bg-error-500'}
    position="tr"
    class="mt-8"
    rounded="rounded-md"
    buttonDismiss="w-[24px]"
    transitionInParams={{delay: 250}}
    transitionOutParams={{duration: 550}}
/>