import classNames from 'classnames';
import { useRef, useState } from 'react';

import s from './ExpandableElement.module.scss';

interface ExpandableElementProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

export function ExpandableElement({ title, className, children }: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);
    const headerRef = useRef(null);

    return (
        <div className={classNames(s.container, className)} style={expanded ? { flex: 4 } : {}}>
            <div className={s.content}>
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
        </div>
    );
}
