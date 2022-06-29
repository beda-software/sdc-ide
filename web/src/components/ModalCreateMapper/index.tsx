import { ChangeEvent, useState } from 'react';
import { Button } from 'web/src/components/Button';
import { InputField } from 'web/src/components/InputField';
import { MapperInfo } from 'web/src/components/ModalCreateMapper/types';

import s from './ModalCreateMapper.module.scss';

interface ModalCreateMapperProps {
    saveNewMapping: (mapperIdList: string[], mapperInfoList: MapperInfo[]) => void;
    closeModal: (status: 'save' | 'cancel', isRenamedMappingId?: boolean) => void;
    mapperInfoList: MapperInfo[];
}

export function ModalCreateMapper({
    saveNewMapping,
    closeModal,
    mapperInfoList,
}: ModalCreateMapperProps) {
    const [mapperIdList, setMapperIdList] = useState<string[]>([]);
    const [isRenamedMappingId, setIsRenamedMappingId] = useState(false);

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
                                setIsRenamedMappingId={setIsRenamedMappingId}
                            />
                        );
                    })}
                </div>
                <div>
                    <div className={s.button}>
                        <Button
                            onClick={() => {
                                saveNewMapping(mapperIdList, mapperInfoList);
                                closeModal('save', isRenamedMappingId);
                            }}
                        >
                            Save
                        </Button>
                    </div>
                    <div className={s.button}>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                closeModal('cancel');
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

function useInputField(
    index: number,
    mappingId: string,
    mapperIdList: string[],
    setMapperIdList: (newMapperIdList: string[]) => void,
    setIsRenamedMappingId: (isRenamed: boolean) => void,
) {
    const [mappingIdInputValue, setMappingIdInputValue] = useState(mappingId);

    const onMappingIdChange = (e: ChangeEvent<any>) => {
        // TODO HTMLInputElement type in ChangeEvent
        const newMapperIdList = [...mapperIdList];
        newMapperIdList[index] = e.target.value;
        setMapperIdList(newMapperIdList);
        setMappingIdInputValue(e.target.value);
        setIsRenamedMappingId(true);
    };

    return {
        mappingIdInputValue,
        onMappingIdChange,
    };
}

interface InputType {
    index: number;
    mappingId: string;
    mapperIdList: string[];
    setMapperIdList: (newMapperIdList: string[]) => void;
    setIsRenamedMappingId: (isRenamed: boolean) => void;
}

const Input = (props: InputType) => {
    const { index, mappingId, mapperIdList, setMapperIdList, setIsRenamedMappingId } = props;
    const { mappingIdInputValue, onMappingIdChange } = useInputField(
        index,
        mappingId,
        mapperIdList,
        setMapperIdList,
        setIsRenamedMappingId,
    );

    return (
        <InputField
            input={{
                name: 'mappingId',
                value: mappingIdInputValue,
                onChange: onMappingIdChange,
                onBlur: () => {},
                onFocus: () => {},
            }}
            meta="testmeta"
            label="mapper id"
        />
    );
};
