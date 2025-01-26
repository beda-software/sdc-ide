type JSONObject = { [key: string]: any };
type JSONArray = Array<any>;

export function sortKeys<T extends JSONArray | JSONObject>(obj: T, order: string[]): T {
    order = order.includes('*') ? order : [...order, '*'];

    if (Array.isArray(obj)) {
        return obj.map((element) => sortKeys(element, order)) as T;
    }

    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    const keys = Object.keys(obj);

    const sortedKeys = order.flatMap((key) => {
        if (key === '*') {
            return keys.filter((k) => !order.includes(k));
        }
        return keys.includes(key) ? key : [];
    });

    const unmatchedKeys = keys.filter((k) => !sortedKeys.includes(k));
    const finalKeys = [...sortedKeys, ...unmatchedKeys];

    const sortedObj: JSONObject = {};
    for (const key of finalKeys) {
        sortedObj[key] = sortKeys(obj[key], order);
    }

    return sortedObj as T;
}
