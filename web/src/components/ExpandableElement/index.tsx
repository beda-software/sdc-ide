import React, { useState } from 'react';

interface ExpandableElementProps {
    cssClass: string;
    title: string;
    children: React.ReactElement;
}

export function ExpandableElement(props: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);
    return (
        // todo: move hardcoded styles to scss file?
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2 onClick={() => setExpanded((f) => !f)}>{props.title}</h2>
            {props.children}
        </div>
    );
}
