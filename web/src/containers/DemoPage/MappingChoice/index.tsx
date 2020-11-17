import React from 'react';
import _ from 'lodash';

import s from './MappingChoice.module.scss';

interface MappingChoiceProps {
    mappingIdList: string[];
    mappingId?: string;
    setMappingId: (id: string) => void;
}

export function MappingChoice({ mappingIdList, mappingId, setMappingId }: MappingChoiceProps) {
    if (mappingIdList.length === 1) {
        return <div> </div>;
    }

    return (
        <div className={s.wrapper}>
            {_.map(mappingIdList, (id) => (
                <a
                    type={'button'}
                    key={id}
                    onClick={() => {
                        setMappingId(id);
                    }}
                    className={id === mappingId ? s.checked : s.item}
                >
                    {id}
                </a>
            ))}
        </div>
    );
}
