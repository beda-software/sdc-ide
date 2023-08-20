import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { InputField } from 'web/src/components/InputField';

import { Mapping } from 'shared/src/contrib/aidbox';

import s from './ModalCreateMapper.module.scss';

interface ModalCreateMapperProps {
    saveMapping: (mappingId: string) => void;
    closeModal: () => void;
    mappings: Mapping[];
}

export function ModalCreateMapper({ saveMapping, closeModal, mappings }: ModalCreateMapperProps) {
    const mappingIds = useMemo(() => mappings.map((m) => m.id), [mappings]);
    const [mappingId, setMappingId] = useState(mappingIds[0] || '');

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new mapper?</div>
                {mappingIds.length ? (
                    <div style={{ fontSize: 12 }}>Mapping id in use: {mappingIds.join(', ')}</div>
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
                <Button
                    onClick={() => {
                        if (mappingIds.includes(mappingId)) {
                            toast.error(
                                `The id ${mappingId} is already in use for Mapping. Please use another id.`,
                            );

                            return;
                        }

                        if (mappingId) {
                            saveMapping(mappingId);
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
