import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { MappingEditorProps } from './interfaces';
import s from './MappingEditor.module.scss';
import { MappingEditorEditor } from './MappingEditorEditor';
import { MappingEditorError } from './MappingEditorError';
import { MappingEditorSelect } from './MappingEditorSelect';
import { useMappingEditor } from './useMappingEditor';

export function MappingEditor(props: MappingEditorProps) {
    const {
        mappingRD,
        questionnaireRD,
        questionnaireResponseRD } = props;
    const { mappingsRD, showModal,
        setShowModal, setUpdatedResource,
        updatedResource, editorState,
        setEditorSelect } = useMappingEditor(questionnaireRD, questionnaireResponseRD, mappingRD);

    const mapEditorStateRender = {
        'initial': <>Please, select/create Questionnaire resource</>,
        'loading': <>Loading...</>,
        'select': <MappingEditorSelect
            {...props}
            mappingsRD={mappingsRD}
            showModal={showModal}
            setShowModal={setShowModal}
            setEditorSelect={setEditorSelect}
        />,
        'ready': <RenderRemoteData
            renderFailure={(error) => <MappingEditorError error={error} setEditorSelect={setEditorSelect} editorState={editorState} />}
            remoteData={mappingRD}
        >
            {(mapping) => {
                return (
                    <MappingEditorEditor
                        {...props}
                        updatedResource={updatedResource}
                        setUpdatedResource={setUpdatedResource}
                        mapping={mapping}
                        setEditorSelect={setEditorSelect}
                    />
                )
            }}
        </RenderRemoteData>
    }

    return (
        <div className={s.container}>
            {mapEditorStateRender[editorState]}
        </div>
    );
}
