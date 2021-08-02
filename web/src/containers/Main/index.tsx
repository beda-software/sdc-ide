import React from 'react';
import ReactDOM from 'react-dom';
import { useParams } from 'react-router-dom';
import { useMain } from 'src/containers/Main/hooks';
import { Menu } from 'src/components/Menu';
import { Logo } from 'src/components/Logo';
import { ExpandableRow } from 'src/components/ExpandableRow';
import { ExpandableElement } from 'src/components/ExpandableElement';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { LaunchContextDisplay } from 'src/components/LaunchContextDisplay';
import { MappingSelect } from 'src/components/MappingSelect';
import { QRFormWrapper } from 'src/components/QRFormWrapper';
import { Button } from 'src/components/Button';
import { ResourceCodeEditor } from 'src/components/ResourceCodeEditor';

import s from './Main.module.scss';
import ModalWindow from 'src/components/ModalWindow';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const {
        launchContext,
        dispatch,
        fhirMode,
        setFhirMode,
        questionnaireRD,
        questionnaireFHIRRD,
        saveQuestionnaireFHIR,
        questionnaireResponseRD,
        saveQuestionnaireResponse,
        mappingList,
        activeMappingId,
        setActiveMappingId,
        mappingRD,
        saveMapping,
        batchRequestRD,
        applyMappings,
        error,
        setError,
    } = useMain(questionnaireId);
    let modalEl = document.getElementById('modal');
    return (
        <>
            <div className={s.mainContainer}>
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement title="Launch Context" cssClass={s.patientFHIRResourceBox}>
                        <LaunchContextDisplay parameters={launchContext} />
                    </ExpandableElement>
                    <ExpandableElement title="Questionnaire FHIR Resource" cssClass={s.questFHIRResourceBox}>
                        <div>
                            {error &&
                                modalEl &&
                                ReactDOM.createPortal(<ModalWindow setError={setError} error={error} />, modalEl)}
                            <ResourceCodeEditor resourceRD={questionnaireFHIRRD} onSave={saveQuestionnaireFHIR} />
                        </div>
                    </ExpandableElement>
                    <ExpandableElement title="Patient Form" cssClass={s.patientFormBox}>
                        <QRFormWrapper
                            questionnaireRD={questionnaireRD}
                            questionnaireResponseRD={questionnaireResponseRD}
                            saveQuestionnaireResponse={saveQuestionnaireResponse}
                        />
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow cssClass={s.lowerRowContainer}>
                    <ExpandableElement
                        title="QuestionnaireResponse FHIR resource"
                        cssClass={s.questionnaireResponseFHIRResourceBox}
                    >
                        <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />
                    </ExpandableElement>
                    <ExpandableElement title="Patient JUTE Mapping" cssClass={s.patientMapperBox}>
                        <div>
                            <MappingSelect
                                mappingList={mappingList}
                                activeMappingId={activeMappingId}
                                setActiveMappingId={setActiveMappingId}
                            />
                            <ResourceCodeEditor resourceRD={mappingRD} onSave={saveMapping} />
                        </div>
                    </ExpandableElement>
                    <ExpandableElement title="Patient batch request" cssClass={s.patientBatchRequestBox}>
                        <div>
                            <ResourceCodeDisplay resourceResponse={batchRequestRD} />
                            <Button onClick={applyMappings}>Apply</Button>
                        </div>
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <Menu
                launchContext={launchContext}
                dispatch={dispatch}
                questionnaireId={questionnaireId}
                fhirMode={fhirMode}
                setFhirMode={setFhirMode}
                questionnaireRD={questionnaireRD}
            />
            <Logo />
        </>
    );
}
