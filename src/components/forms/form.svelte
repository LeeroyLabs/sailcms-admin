<script>
    export const validate = () =>
    {
        let form = document.getElementById('pageform');
        let errorElements = form.querySelectorAll('.is-error');

        if (errorElements.length > 0) {
            return false;
        }

        return true;
    }
</script>

<div id="pageform">
    <slot/>
</div>