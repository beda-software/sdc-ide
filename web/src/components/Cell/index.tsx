import classNames from 'classnames';

import s from './Cell.module.scss';

interface CellProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    even?: boolean;
}

export function Cell({ title, children, even }: CellProps) {
    const isEven = even ?? false;

    return (
        <div className={classNames(s.container, isEven ? s.evenContainer : s.oddContainer)}>
            <div className={s.content}>
                <div className={s.boxHeader}>
                    <h2 className={s.title}>{title}</h2>
                </div>
                {children}
            </div>
        </div>
    );
}
