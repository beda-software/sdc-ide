import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ModalCreateMapper } from 'web/src/components/ModalCreateMapper';
import { Select } from 'web/src/components/Select';

import { RenderRemoteData, formatError } from '@beda.software/fhir-react';
import { isFailure, isSuccess } from '@beda.software/remote-data';

import formStyles from '../../../../components/QRFormWrapper/QuestionnaireResponseForm.module.scss';
import { PromptForm } from '../../PromptForm';
import { MappingEditorSelectProps } from '../interfaces';
import s from '../MappingEditor.module.scss';

export function MappingEditorSelect(props: MappingEditorSelectProps) {
    const {
        mappingsRD,
        mappingRD,
        showModal,
        generateMapping,
        createMapping,
        setShowModal,
        toggleMappingMode,
        onChange,
        setEditorSelect,
    } = props;

    return (
        <RenderRemoteData remoteData={mappingsRD}>
            {(mappings) => (
                <>
                    <div className={formStyles.field}>
                        <div className={formStyles.label}>Choose mapper from the list</div>
                        <Select
                            value={
                                isSuccess(mappingRD)
                                    ? {
                                          value: mappingRD.data,
                                          label: mappingRD.data.id,
                                      }
                                    : undefined
                            }
                            options={mappings.map((mapping) => ({
                                value: mapping,
                                label: mapping.id,
                            }))}
                            onChange={(option) => {
                                if (option && !Array.isArray(option)) {
                                    setEditorSelect();
                                    onChange((option as SingleValue<any>).value);
                                }
                            }}
                        />
                    </div>
                    <div />
                    <PromptForm
                        id="mapping"
                        onSubmit={generateMapping}
                        goBack={() => setEditorSelect()}
                        label="or describe requirements to new mapper"
                    />
                    <div className={s.actions}>
                        <Button
                            className={s.action}
                            variant="secondary"
                            onClick={() => {
                                setEditorSelect();
                            }}
                        >
                            cancel
                        </Button>
                        <Button className={s.action} onClick={() => setShowModal(true)}>
                            Add blank mapper
                        </Button>
                        <Button className={s.action} onClick={() => toggleMappingMode()}>
                            Add FHIRMapping Language
                        </Button>
                    </div>

                    {showModal ? (
                        <ModalCreateMapper
                            saveMapping={async (mappingId) => {
                                const response = await createMapping({
                                    resourceType: 'Mapping',
                                    id: mappingId,
                                    body: {},
                                });

                                if (isSuccess(response)) {
                                    setEditorSelect();
                                }

                                if (isFailure(response)) {
                                    toast.error(formatError(response.error));
                                }
                            }}
                            closeModal={() => setShowModal(false)}
                            mappings={mappings}
                        />
                    ) : null}
                </>
            )}
        </RenderRemoteData>
    );
}
