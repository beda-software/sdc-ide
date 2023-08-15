import { useState } from 'react';

import s from './ExpandableRow.module.scss';
import { Arrow } from '../Icon/Arrow';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export function ExpandableRow(props: Props) {
    const { className, children } = props;
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={className} style={expanded ? { flex: 4 } : {}}>
            <button className={s.arrow} onClick={() => setExpanded((f) => !f)}>
                <Arrow direction={expanded ? 'down' : 'up'} />
            </button>
            {children}
        </div>
    );
}
