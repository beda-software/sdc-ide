import { useMemo, useState } from 'react';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { InputField } from 'web/src/components/InputField';
import { Select } from 'web/src/components/Select';

import { Mapping } from 'shared/src/contrib/aidbox';

import s from './ModalCreateMapper.module.scss';
import { FieldWrapper } from '../FieldWrapper';

type MapperType = Mapping['type'];

interface ModalCreateMapperProps {
    saveMapping: (partialMapping: Partial<Mapping>) => void;
    closeModal: () => void;
    mappings: Mapping[];
}

interface OptionType {
    label: MapperType;
    value: MapperType;
}

export function ModalCreateMapper({ saveMapping, closeModal, mappings }: ModalCreateMapperProps) {
    const mappingIds = useMemo(() => mappings.map((m) => m.id), [mappings]);
    const [mappingId, setMappingId] = useState(mappingIds[0] || '');
    const [mappingType, setMappingType] = useState<MapperType>('FHIRPath');

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new mapper?</div>
                {mappingIds.length ? (
                    <div style={{ fontSize: 12, color: 'red' }}>
                        Mapping id in use: {mappingIds.join(', ')}
                    </div>
                ) : null}
                <InputField
                    input={{
                        value: mappingId,
                        onChange: (e) => setMappingId(e.target.value),
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    label="Mapping id"
                />
                <FieldWrapper label="Mapping type">
                    <Select<OptionType>
                        value={{ value: mappingType, label: mappingType }}
                        options={['FHIRPath', 'JUTE'].map((value) => ({
                            value: value as MapperType,
                            label: value as MapperType,
                        }))}
                        onChange={(option) =>
                            setMappingType((option as SingleValue<OptionType>)?.value)
                        }
                    />
                </FieldWrapper>

                <Button
                    onClick={() => {
                        if (mappingIds.includes(mappingId)) {
                            toast.error(
                                `The id ${mappingId} is already in use for Mapping. Please use another id.`,
                            );

                            return;
                        }

                        if (mappingId) {
                            saveMapping({ id: mappingId, type: mappingType });
                            closeModal();
                        }
                    }}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
