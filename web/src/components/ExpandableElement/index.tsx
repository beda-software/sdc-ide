import classNames from 'classnames';
import { ReactElement, useRef, useState } from 'react';
import { Title } from 'web/src/containers/Main/types';

import s from './ExpandableElement.module.scss';

interface ExpandableElementProps {
    cssClass: string;
    title: Title | ReactElement;
    children: ReactElement;
}

export function ExpandableElement({ title, cssClass, children }: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);

    const headerRef = useRef(null);

    return (
        <div className={classNames(cssClass, s.formBox)} style={expanded ? { flex: 4 } : {}}>
            <div className={s.boxHeader}>
                <h2 className={s.title}>{title}</h2>
                {expanded ? (
                    <div
                        className={classNames(s.expandButton, s.expanded)}
                        ref={headerRef}
                        onClick={(e) => {
                            if (e.target === headerRef.current) {
                                setExpanded((f) => !f);
                            }
                        }}
                    >
                        {expanded ? 'collapse' : 'expand'}
                    </div>
                ) : (
                    <div
                        className={s.expandButton}
                        ref={headerRef}
                        onClick={(e) => {
                            if (e.target === headerRef.current) {
                                setExpanded((f) => !f);
                            }
                        }}
                    >
                        {expanded ? 'collapse' : 'expand'}
                    </div>
                )}
            </div>
            {children}
        </div>
    );
}
