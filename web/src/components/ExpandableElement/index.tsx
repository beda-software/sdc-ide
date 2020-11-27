import React, { useState } from 'react';

import s from './ExpandableElement.module.scss';

interface ExpandableElementProps {
    cssClass: string;
    title: string;
    children: React.ReactElement;
}

export function ExpandableElement(props: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2 className={s.title} onClick={() => setExpanded((f) => !f)}>
                {props.title}
            </h2>
            {props.children}
        </div>
    );
}
