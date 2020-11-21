import React, { useState } from 'react';
import { arrowDown, arrowUp } from 'src/components/Icon';

interface ExpandableRowProps {
    cssClass: string;
    children: Array<React.ReactElement>;
}

export function ExpandableRow(props: ExpandableRowProps) {
    const [expanded, setExpanded] = useState(false);
    // todo: refactor hardcoded colors
    const symbol = expanded ? arrowDown('#597EF7') : arrowUp('#597EF7');
    return (
        // todo: move hardcoded styles to scss file?
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2 style={{ position: 'absolute', left: '6px' }} onClick={() => setExpanded((f) => !f)}>
                {symbol}
            </h2>
            {props.children}
        </div>
    );
}
