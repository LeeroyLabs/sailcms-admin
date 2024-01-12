<script>
    import { Validation } from '$lib/helpers/validation.js';

    export const validate = () =>
    {
        let totalErrors = 0;
        let form = document.getElementById('pageform');
        let elements = form.querySelectorAll('.validation');

        for (let element of elements) {
            let validate = element.getAttribute('data-validate');
            let validation = element.getAttribute('data-validation');
            let errorEl = element.getAttribute('data-error-id');

            if (validate && validate === 'true') {
                let rules = validation.split(',');
                let isValid = true;

                for (let rule of rules) {
                    const result = Validation.validate(element.value, rule);
                    if (!result) isValid = false;
                }

                if (!isValid) {
                    element.classList.add('is-error', '!border-error-500');
                    if (errorEl) document.getElementById(errorEl).classList.add('!visible');
                    totalErrors++;
                } else {
                    element.classList.remove('is-error', '!border-error-500');
                    if (errorEl) document.getElementById(errorEl).classList.remove('!visible');
                }
            }
        }

        return totalErrors === 0;
    }
</script>

<div id="pageform">
    <slot/>
</div>