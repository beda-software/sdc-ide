import ReactSelect, { Props } from 'react-select';
import ReactAsyncSelect, { AsyncProps } from 'react-select/async';

import s from './ResourceSelect.module.scss';

export function Select<T>(props: Props<T>) {
    return (
        <div className={s.select}>
            <ReactSelect classNamePrefix="react-select" {...props} />
        </div>
    );
}

export function AsyncSelect<T>(props: AsyncProps<T, any, any>) {
    return (
        <div className={s.select}>
            <ReactAsyncSelect classNamePrefix="react-select" {...props} />
        </div>
    );
}
