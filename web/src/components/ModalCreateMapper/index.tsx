import React, { useState } from 'react';
import { Button } from '../Button';
import { InputField } from '../InputField';

import s from './ModalCreateMapper.module.scss';
import { MapperInfo } from './types';

interface ModalCreateMapperProps {
    saveMapper: (mapperIdList: string[], mapperInfoList: MapperInfo[]) => void;
    closeModal: () => void;
    mapperInfoList: MapperInfo[];
}

export function ModalCreateMapper({ saveMapper, closeModal, mapperInfoList }: ModalCreateMapperProps) {
    const [mapperIdList, setMapperIdList] = useState<string[]>([]);

    if (mapperIdList.length === 0) {
        const mappingIdList: string[] = [];
        mapperInfoList.map((mapperInfo) => mappingIdList.push(mapperInfo.mappingId));
        setMapperIdList(mappingIdList);
    }

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new mapper?</div>
                <div className={s.input}>
                    {mapperIdList.map((mappingId, index) => {
                        return (
                            <Input
                                key={index}
                                index={index}
                                mappingId={mappingId}
                                mapperIdList={mapperIdList}
                                setMapperIdList={setMapperIdList}
                            />
                        );
                    })}
                </div>
                <div>
                    <div className={s.button}>
                        <Button
                            onClick={() => {
                                saveMapper(mapperIdList, mapperInfoList);
                                closeModal();
                            }}
                        >
                            Save
                        </Button>
                    </div>
                    <div className={s.button}>
                        <Button
                            onClick={() => {
                                closeModal();
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InputType {
    index: number;
    mappingId: string;
    mapperIdList: string[];
    setMapperIdList: (newMapperIdList: string[]) => void;
}

const Input = ({ index, mappingId, mapperIdList, setMapperIdList }: InputType) => {
    const [inputValue, setInputValue] = useState(mappingId);
    return (
        <InputField
            input={{
                name: 'mappingId',
                value: inputValue,
                onChange: (e) => {
                    const newMapperIdList = [...mapperIdList];
                    newMapperIdList[index] = e.target.value;
                    setMapperIdList(newMapperIdList);
                    setInputValue(e.target.value);
                },
                onBlur: () => {},
                onFocus: () => {},
            }}
            meta="testmeta"
            label="mapper id"
        />
    );
};
