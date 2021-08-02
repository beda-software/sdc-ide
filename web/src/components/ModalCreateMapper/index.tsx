import React, { useState } from 'react';
import { Questionnaire } from 'shared/src/contrib/aidbox';
import { Button } from '../Button';
import { InputField } from '../InputField';

import s from './ModalCreateMapper.module.scss';

interface ModalCreateMapperProps {
    saveMapper: (arg0: string) => void;
    cancelCreateMapper: () => void;
    mapperInfo: [string, Questionnaire, number, number];
}

export function ModalCreateMapper({ saveMapper, cancelCreateMapper, mapperInfo }: ModalCreateMapperProps) {
    const [newMapperId, setNewMapperId] = useState(mapperInfo[0]);
    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new mapper?</div>
                <InputField
                    input={{
                        name: 'mappingId',
                        value: newMapperId,
                        onChange: (e) => {
                            setNewMapperId(e.target.value);
                        },
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    meta="testmeta"
                    label="mapper id"
                />
                <Button onClick={() => saveMapper(newMapperId)}>save</Button>
                <Button onClick={() => cancelCreateMapper()}>cancel</Button>
            </div>
        </div>
    );
}
