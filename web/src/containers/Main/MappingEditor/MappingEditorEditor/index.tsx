import classNames from 'classnames';
import { WithId } from "fhir-react";
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from "web/src/components/ResourceCodeEditor";

import { Mapping } from "shared/src/contrib/aidbox";

import { MappingEditorEditorProps } from '../interfaces';
import s from '../MappingEditor.module.scss';


export function MappingEditorEditor(props: MappingEditorEditorProps) {
    const { reload, onChange, updatedResource, onSave, setUpdatedResource, mapping, launchContext, questionnaireResponseRD, setEditorSelect } = props;

    return (
        <>
            <ResourceCodeEditor<WithId<Mapping>>
                reload={() => {
                    reload();
                    setUpdatedResource(undefined);
                }}
                resource={mapping}
                onChange={(updatedMapping) => {
                    setUpdatedResource(updatedMapping);
                    onChange(updatedMapping);
                }}
                launchContext={launchContext}
                questionnaireResponseRD={questionnaireResponseRD}
            />
            <div className={s.actions}>
                <Button
                    className={s.action}
                    variant="secondary"
                    onClick={() => {
                        setEditorSelect();
                    }}
                >
                    clear
                </Button>
                <Button
                    className={classNames(s.action, {
                        _active: !!updatedResource,
                    })}
                    onClick={() => {
                        if (updatedResource) {
                            onSave(updatedResource);
                            setUpdatedResource(undefined);
                        }
                    }}
                >
                    save mapping
                </Button>
            </div>
        </>
    );
}