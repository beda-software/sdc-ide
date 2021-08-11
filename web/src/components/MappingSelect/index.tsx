import React from 'react';
import _ from 'lodash';

import { Mapping, Reference } from 'shared/src/contrib/aidbox';

import s from './MappingSelect.module.scss';

interface MappingSelectProps {
    mappingList: Reference<Mapping>[];
    activeMappingId: string | undefined;
    setActiveMappingId: (mappingId: string | undefined) => void;
}

export function MappingSelect({ mappingList, activeMappingId, setActiveMappingId }: MappingSelectProps) {
    if (mappingList.length === 1) {
        return <div />;
    }

    return (
        <div className={s.wrapper}>
            {_.map(mappingList, ({ id }, index) => (
                <button
                    type={'button'}
                    // href="/#"
                    key={id + String(index)}
                    onClick={() => {
                        setActiveMappingId(id);
                    }}
                    className={id === activeMappingId ? s.checked : s.item}
                >
                    {id}
                </button>
            ))}
        </div>
    );
}
