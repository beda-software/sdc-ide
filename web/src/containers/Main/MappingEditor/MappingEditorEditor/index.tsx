import { Mapping } from '@beda.software/aidbox-types';
import classNames from 'classnames';
import { WithId } from 'fhir-react';
import _ from 'lodash';
import { useCallback } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';

import { MappingEditorEditorProps } from '../interfaces';
import s from '../MappingEditor.module.scss';

export function MappingEditorEditor(props: MappingEditorEditorProps) {
    const {
        reload,
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

    const onChange = useCallback(_.debounce(props.onChange, 250), [props.onChange]);
    useBeforeUnload((event) => {
        if (updatedResource) {
            event.preventDefault();
        }
    });

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
                onSubmit={async (submittedResource) => {
                    const response = await onSave(submittedResource);

                    if (isSuccess(response)) {
                        setUpdatedResource(undefined);
                    }
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
                    back
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
