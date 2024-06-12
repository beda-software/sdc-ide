import { Button } from "web/src/components/Button";

import { formatError } from "fhir-react/lib/utils/error";

import { MappingEditorErrorProps } from "../interfaces";
import s from '../MappingEditor.module.scss';

export function MappingEditorError(props: MappingEditorErrorProps) {
    const {error, setEditorSelect, editorState} = props;

    return editorState !== 'ready' ? (
        <div>
            {formatError(error)}
            {error?.id === 'not-found' ? (
                <div className={s.actions}>
                    <Button
                        className={s.action}
                        variant="secondary"
                        onClick={() => {
                            setEditorSelect();
                        }}
                    >
                        create new
                    </Button>
                </div>
            ) : null}
        </div>
    ) : (
        <div />
    )
}