import { useEffect, useState } from 'react';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import {
    isLoading,
} from 'fhir-react/lib/libs/remoteData';
import { WithId } from 'fhir-react/lib/services/fhir';

import { Mapping } from 'shared/src/contrib/aidbox';

import { MappingEditorProps } from './interfaces';
import s from './MappingEditor.module.scss';
import { MappingEditorEditor } from './MappingEditorEditor';
import { MappingEditorError } from './MappingEditorError';
import { MappingEditorSelect } from './MappingEditorSelect';
import { useMappingEditor } from './useMappingEditor';

export function MappingEditor(props: MappingEditorProps) {
    const {
        onSave,
        onChange,
        mappingRD,
        questionnaireRD,
        questionnaireResponseRD,
        createMapping,
        reload,
        generateMapping,
        toggleMappingMode
    } = props;
    const { mappingsRD } = useMappingEditor(questionnaireRD);
    const [showSelect, setShowSelect] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<WithId<Mapping> | undefined>();

    useEffect(() => {
        if (isLoading(questionnaireResponseRD)) {
            setShowSelect(false);
        }
    }, [questionnaireResponseRD]);

    return (
        <div className={s.container}>
            <RenderRemoteData
                renderFailure={(error) => <MappingEditorError error={error} showSelect={showSelect} setShowSelect={setShowSelect} />}
                remoteData={mappingRD}
            >
                {(mapping) => <>{!showSelect ? <MappingEditorEditor {...props} launchContext={props.launchContext} questionnaireResponseRD={questionnaireResponseRD} reload={reload} updatedResource={updatedResource} setUpdatedResource={setUpdatedResource} setShowSelect={setShowSelect} onSave={onSave} onChange={onChange} mapping={mapping} /> : null}</>}
            </RenderRemoteData>
            {showSelect ? <MappingEditorSelect {...props} toggleMappingMode={toggleMappingMode} onChange={onChange} mappingRD={mappingRD} mappingsRD={mappingsRD} showModal={showModal} setShowModal={setShowModal} setShowSelect={setShowSelect} generateMapping={generateMapping} createMapping={createMapping} /> : null}
        </div>
    );
}
