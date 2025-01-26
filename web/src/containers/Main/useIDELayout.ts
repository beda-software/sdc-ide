import { useLocalStorage } from 'shared/src/hooks/local-storage';

interface IDELayout {
    vertical: number[];
    horizontal1: number[];
    horizontal2: number[];
}

export function useIDELayout() {
    const [layout, setLayoutRaw] = useLocalStorage<IDELayout>('sdc-ide-layout', {
        vertical: [1, 1],
        horizontal1: [1, 1, 1],
        horizontal2: [1, 1, 1],
    });
    const setLayout = (key: keyof IDELayout, values: IDELayout[typeof key]) => {
        setLayoutRaw((prevLayout) => ({ ...prevLayout, [key]: values }));
    };

    return { layout, setLayout };
}
