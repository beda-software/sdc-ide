import classNames from 'classnames';
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
    const expandBox = (e) => {
        if (e.target === headerRef.current) {
            setExpanded((f) => !f);
        }
    };

    return (
        <div className={classNames(cssClass, s.formBox)} style={expanded ? { flex: 4 } : {}}>
            <div className={s.boxHeader}>
                <h2 className={s.title}>{title}</h2>
                {expanded ? (
                    <div
                        className={classNames(s.expandButton, s.expanded)}
                        ref={headerRef}
                        onClick={expandBox}
                    >
                        {expanded ? 'collapse' : 'expand'}
                    </div>
                ) : (
                    <div className={s.expandButton} ref={headerRef} onClick={expandBox}>
                        {expanded ? 'collapse' : 'expand'}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
