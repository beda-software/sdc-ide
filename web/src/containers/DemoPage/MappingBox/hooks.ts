import { useState } from 'react';
import { arrowDown, arrowUp } from 'src/images';

export function useShowMapping() {
    const [showMapping, setShowMapping] = useState<boolean>(true);

    const toggleShowMapping = () => {
        setShowMapping(!showMapping);
    };

    const wrapperStyle = { display: showMapping ? 'inline' : 'none' };

    const symbol = showMapping ? arrowUp : arrowDown;

    return { toggleShowMapping, wrapperStyle, symbol };
}
