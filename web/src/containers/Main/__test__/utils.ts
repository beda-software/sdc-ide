import { isLoading } from 'aidbox-react/lib/libs/remoteData';

/**
 * Just print an object with name and separators
 */
export function draw(obj: any, name: string) {
    console.log(`---------------------------------------------------------------------------------------`, name);
    console.log(obj);
    console.log(`----------------------------------------------------------------------------------------/`);
}

/**
 * It runs a callback until RemoteData resource is resolved.
 */
export async function waitToResolve(res: any, callback: any, name: string) {
    let updatesCount = 0;
    while (isLoading(res.current[name])) {
        await callback();
        updatesCount = updatesCount + 1;
    }
    console.log(`------------------- waitToResolve for ${name} is finished with ${updatesCount} iterations`);
}
