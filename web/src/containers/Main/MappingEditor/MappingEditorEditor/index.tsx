import classNames from 'classnames';
import { WithId } from 'fhir-react';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';

import { Mapping } from 'shared/src/contrib/aidbox';

import { MappingEditorEditorProps } from '../interfaces';
import s from '../MappingEditor.module.scss';

export function MappingEditorEditor(props: MappingEditorEditorProps) {
    const {
        reload,
        onChange,
        updatedResource,
        onSave,
        setUpdatedResource,
        parseError,
        setParseError,
        mapping,
        launchContext,
        questionnaireResponseRD,
        setEditorSelect,
    } = props;

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
                onParseError={setParseError}
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
                    onClick={async () => {
                        if (parseError) {
                            toast.error(
                                `Cannot parse YAML on line ${parseError.mark.line}: ${parseError.reason}`,
                                { autoClose: false },
                            );

                            return;
                        }

                        if (updatedResource) {
                            const response = await onSave(updatedResource);
                            if (isSuccess(response)) {
                                setUpdatedResource(undefined);
                            }
                        }
                    }}
                >
                    save mapping
                </Button>
            </div>
        </>
    );
}
