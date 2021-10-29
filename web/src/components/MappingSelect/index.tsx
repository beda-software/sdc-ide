import React from 'react';
import _ from 'lodash';

import { Mapping, Reference } from 'shared/src/contrib/aidbox';
import { Action, ErrorDebugState } from 'src/containers/Main/hooks/errorDebugHook';
import { ErrorButton } from 'src/components/ErrorButton';

import s from './MappingSelect.module.scss';

interface MappingSelectProps {
    mappingList: Reference<Mapping>[];
    activeMappingId: string | undefined;
    setActiveMappingId: (mappingId: string | undefined) => void;
    title: string;
    errorState?: ErrorDebugState;
    errorDispatch: React.Dispatch<Action>;
}

export function MappingSelect(props: MappingSelectProps) {
    const { mappingList, activeMappingId, setActiveMappingId, errorState, title, errorDispatch } = props;

    if (mappingList.length === 1) {
        return <div />;
    }

    const selectMapping = (id?: string) => {
        if (id !== activeMappingId) {
            errorDispatch({ type: 'reset mapping errors' });
            setActiveMappingId(id);
        }
    };

    return (
        <div className={s.wrapper}>
            {_.map(mappingList, ({ id }, index) => (
                <>
                    <button
                        type={'button'}
                        key={id + String(index)}
                        onClick={() => selectMapping(id)}
                        className={id === activeMappingId ? s.checked : s.item}
                    >
                        {id}
                        {title === 'Patient JUTE Mapping' &&
                            errorState?.showMappingErrors &&
                            id === activeMappingId &&
                            mappingList.length > 1 && <ErrorButton errorState={errorState} title={title} />}
                    </button>
                </>
            ))}
        </div>
    );
}
