import React, { useRef, useState } from 'react';
import { Title } from 'src/containers/Main/types';
import s from './ExpandableElement.module.scss';

interface ExpandableElementProps {
    cssClass: string;
    title: Title | React.ReactElement;
    children: React.ReactElement;
}

export function ExpandableElement({ title, cssClass, children }: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);

    const headerRef = useRef(null);

    return (
        <div className={cssClass} style={expanded ? { flex: 4 } : {}}>
            <div>
                <h2
                    className={s.title}
                    ref={headerRef}
                    onClick={(e) => {
                        if (e.target === headerRef.current) {
                            setExpanded((f) => !f);
                        }
                    }}
                >
                    {title}
                </h2>
            </div>
            {children}
        </div>
    );
}
