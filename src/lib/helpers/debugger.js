export function debug(mode, category, message)
{
    if (import.meta.env.VITE_DEBUG === 'true') {
        switch (mode)
        {
            case 'log':
            default:
                console.log(`[DEBUG:LOG] > ${category} > ${message}`);
                break;

            case 'warning':
            case 'warn':
                console.trace(`[DEBUG:WARN] > ${category} > ${message}`);
                break;

            case 'error':
                console.trace(`[DEBUG:ERROR] > ${category} > ${message}`);
                break;

            case 'info':
                console.trace(`[DEBUG:INFO] > ${category} > ${message}`);
                break;
        }
    }
}