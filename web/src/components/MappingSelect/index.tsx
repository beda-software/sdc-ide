import React from 'react';
import _ from 'lodash';

import { Mapping } from 'shared/lib/contrib/aidbox';

import s from './MappingSelect.module.scss';

interface MappingSelectProps {
    mappingList: Mapping[];
    activeMappingId: string | undefined;
    setActiveMappingId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function MappingSelect({ mappingList, activeMappingId, setActiveMappingId }: MappingSelectProps) {
    if (mappingList.length === 1) {
        return <div></div>;
    }

    return (
        <div className={s.wrapper}>
            {_.map(mappingList, ({ id }) => (
                <a
                    type={'button'}
                    key={id}
                    onClick={() => {
                        setActiveMappingId(id);
                    }}
                    className={id === activeMappingId ? s.checked : s.item}
                >
                    {id}
                </a>
            ))}
        </div>
    );
}
