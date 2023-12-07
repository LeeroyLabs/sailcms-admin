export function isSectionActive(url)
{
    if (window.location.href.includes(url)) return true;
    return false;
}