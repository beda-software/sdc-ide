import { Questionnaire, Parameters, Resource, QuestionnaireResponse } from 'fhir/r4b';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { ModalExpression } from 'web/src/components/ModalExpression';
import { useExpressionModal } from 'web/src/components/ResourceCodeEditor/hooks';
import { SourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';

import s from './ResourceCodeEditor.module.scss';

interface ResourceCodeEditorProps<R> {
    resource: R;
    onChange: (resource: R) => void;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    reload: () => void;
}

export function ResourceCodeEditor<R extends Resource>({
    resource,
    onChange,
    launchContext,
    questionnaireResponseRD,
    reload,
}: ResourceCodeEditorProps<R>) {
    const { expressionModalInfo, closeExpressionModal, setExpression, openExpressionModal } =
        useExpressionModal();

    return (
        <div className={s.content}>
            <CodeEditor
                key={JSON.stringify(resource)}
                valueObject={resource}
                onChange={(r) => onChange(r)}
                openExpressionModal={openExpressionModal}
                reload={reload}
                // options={{ readOnly: false }}
                options={{ readOnly: true }}
            />
            {expressionModalInfo &&
                (expressionModalInfo.type === 'SourceQueries' ? (
                    <SourceQueryDebugModal
                        sourceQueryId={expressionModalInfo?.expression || ''}
                        closeExpressionModal={closeExpressionModal}
                        launchContext={launchContext}
                        resource={resource as any as Questionnaire}
                    />
                ) : (
                    <ModalExpression
                        expressionModalInfo={expressionModalInfo}
                        launchContext={launchContext}
                        questionnaireResponseRD={questionnaireResponseRD}
                        closeExpressionModal={closeExpressionModal}
                        setExpression={setExpression}
                    />
                ))}
        </div>
    );
}
