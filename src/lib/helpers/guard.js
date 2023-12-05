
export function authenticationGuard()
{
    return new Promise(async (resolve, reject) =>
    {
        resolve(true);
    });
}