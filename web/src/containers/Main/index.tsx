import React from 'react';
import { useParams } from 'react-router-dom';
import { useMain } from 'src/containers/Main/hooks';
import { Menu } from 'src/components/Menu';
import { Logo } from 'src/components/Logo';
import { ExpandableRow } from 'src/components/ExpandableRow';
import { ExpandableElement } from 'src/components/ExpandableElement';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { MappingSelect } from 'src/components/MappingSelect';
import { QRFormWrapper } from 'src/components/QRFormWrapper';
import { Button } from 'src/components/Button';
import { ResourceCodeEditor } from 'src/components/ResourceCodeEditor';
import { ResourceSelect } from 'src/components/ResourceSelect';
import { getPatientFullName } from 'src/utils/resource';

import s from './Main.module.scss';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const {
        setPatientId,
        patientId,
        patientRD,
        patientsRD,
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
    } = useMain(questionnaireId);
    return (
        <>
            <div className={s.mainContainer}>
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement
                        title={
                            <>
                                Patient FHIR resource
                                <ResourceSelect
                                    cssClass={s.resourceSelect}
                                    value={patientId}
                                    bundleResponse={patientsRD}
                                    onChange={setPatientId}
                                    display={getPatientFullName}
                                />
                            </>
                        }
                        cssClass={s.patientFHIRResourceBox}
                    >
                        <ResourceCodeDisplay resourceResponse={patientRD} />
                    </ExpandableElement>
                    <ExpandableElement title="Questionnaire FHIR Resource" cssClass={s.questFHIRResourceBox}>
                        <ResourceCodeEditor resourceRD={questionnaireFHIRRD} onSave={saveQuestionnaireFHIR} />
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
            <Menu />
            <Logo />
        </>
    );
}
