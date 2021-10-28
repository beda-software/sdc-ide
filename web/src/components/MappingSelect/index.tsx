import React from 'react';
import _ from 'lodash';

import { Mapping, Reference } from 'shared/src/contrib/aidbox';
import { Action, ErrorDebugState } from 'src/containers/Main/hooks/errorDebugHook';

import s from './MappingSelect.module.scss';
import { showError } from 'src/containers/Main/hooks';

interface MappingSelectProps {
    mappingList: Reference<Mapping>[];
    activeMappingId: string | undefined;
    setActiveMappingId: (mappingId: string | undefined) => void;
    errorState?: ErrorDebugState;
    title: string;
    errorDispatch: React.Dispatch<Action>;
}

export function MappingSelect(props: MappingSelectProps) {
    const { mappingList, activeMappingId, setActiveMappingId, errorState, title, errorDispatch } = props;

    if (mappingList.length === 1) {
        return <div />;
    }

    return (
        <div className={s.wrapper}>
            {_.map(mappingList, ({ id }, index) => (
                <>
                    <button
                        type={'button'}
                        key={id + String(index)}
                        onClick={() => {
                            if (id !== activeMappingId) {
                                errorDispatch({ type: 'reset mapping errors' });
                                setActiveMappingId(id);
                            }
                            if (errorState && id === activeMappingId) {
                                showError(errorState, title);
                            }
                        }}
                        className={id === activeMappingId ? s.checked : s.item}
                    >
                        {id}
                        {title === 'Patient JUTE Mapping' &&
                            errorState?.showMappingErrors &&
                            id === activeMappingId &&
                            mappingList.length > 1 && (
                                <span className={s.error}>
                                    <span className={s.count}>{errorState.mappingErrorCount}</span>
                                    ERR!
                                </span>
                            )}
                    </button>
                </>
            ))}
        </div>
    );
}
