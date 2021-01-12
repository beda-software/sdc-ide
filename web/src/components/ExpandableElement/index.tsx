import React, { useRef, useState } from 'react';

import s from './ExpandableElement.module.scss';

interface ExpandableElementProps {
    cssClass: string;
    title: string | React.ReactElement;
    children: React.ReactElement;
}

export function ExpandableElement(props: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);
    const headerRef = useRef(null);
    return (
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2
                className={s.title}
                ref={headerRef}
                onClick={(e) => {
                    if (e.target === headerRef.current) {
                        setExpanded((f) => !f);
                    }
                }}
            >
                {props.title}
            </h2>
            {props.children}
        </div>
    );
}
