import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import _ from 'lodash';
import s from './DemoPage.module.scss';

import { Logo } from 'src/components/Logo';
import { MappingBox } from 'src/containers/DemoPage/MappingBox';
import { ResourceDisplayBox } from 'src/containers/DemoPage/ResourceDisplayBox';
import { PatientBatchRequestBox } from 'src/containers/DemoPage/PatientBatchRequestBox';
import { QuestionnaireResourceBox } from 'src/containers/DemoPage/QuestionnaireResourceBox';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Questionnaire, Patient, Bundle, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { RenderRemoteData } from 'src/components/RenderRemoteData';

import { isSuccess, success } from 'aidbox-react/lib/libs/remoteData';
import { PatientFormBox } from 'src/containers/DemoPage/PatientFormBox';
import { service, sequenceMap } from 'aidbox-react/lib/services/service';

import { Menu } from 'src/components/Menu';
import { arrowDown, arrowUp } from 'src/components/Icon';
import { MappingChoice } from 'src/containers/DemoPage/MappingChoice';

export function DemoPage() {
    const { id } = useParams<{ id: string }>();
    const patientId = 'patient';
    const questionnaireId = id;
    const [mappingId, setMappingId] = React.useState<string | undefined>();

    const [batchRequest, setBatchRequest] = React.useState<Bundle<any>>({ resourceType: 'Bundle', type: 'searchset' });
    const [questionnaireResponse, setQuestionnaireResponseInternal] = React.useState<QuestionnaireResponse>({
        resourceType: 'QuestionnaireResponse',
        status: 'draft',
    });

    const setQuestionnaireResponse = useCallback(
        (q: QuestionnaireResponse) => {
            if (!_.isEqual(q, questionnaireResponse)) {
                console.log('SET');
                setQuestionnaireResponseInternal(q);
            }
        },
        [questionnaireResponse],
    );

    const [questionnaireRemoteData, questionnaireManager] = useService(async () => {
        const response = await service<Questionnaire>({
            method: 'GET',
            url: `Questionnaire/${questionnaireId}/$assemble`,
        });

        return response;
    }, [questionnaireId]);

    useEffect(() => {
        if (isSuccess(questionnaireRemoteData)) {
            const firstMappingId = questionnaireRemoteData.data.mapping?.[0].id;
            if (firstMappingId && !mappingId) {
                setMappingId(firstMappingId);
            }
        }
    }, [mappingId, questionnaireRemoteData]);

    const [patientResponse] = useService(
        () =>
            getFHIRResource<Patient>({
                resourceType: 'Patient',
                id: patientId,
            }),
        [patientId],
    );

    const [reloadCounter, setReloadCounter] = useState(0);
    const reload = useCallback(() => setReloadCounter((c) => c + 1), [setReloadCounter]);

    useEffect(() => {
        (async function () {
            if (mappingId) {
                const response = await service({
                    method: 'POST',
                    url: `/Mapping/${mappingId}/$debug`,
                    data: questionnaireResponse,
                });
                if (isSuccess(response)) {
                    setBatchRequest(response.data);
                }
            }
        })();
    }, [questionnaireResponse, reloadCounter, mappingId]);

    return (
        <>
            <div className={s.mainContainer}>
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement title="Patient FHIR resource" cssClass={s.patientFHIRResourceBox}>
                        <ResourceDisplayBox resourceResponse={patientResponse} />
                    </ExpandableElement>
                    <ExpandableElement title="Questionnaire FHIR Resource" cssClass={s.questFHIRResourceBox}>
                        <QuestionnaireResourceBox
                            id={questionnaireId}
                            onQuestionnaireUdpate={questionnaireManager.reload}
                        />
                    </ExpandableElement>
                    <ExpandableElement title="Patient Form" cssClass={s.patientFormBox}>
                        <RenderRemoteData remoteData={sequenceMap({ questionnaireRemoteData, patientResponse })}>
                            {({ questionnaireRemoteData, patientResponse }) => (
                                <PatientFormBox
                                    questionnaire={questionnaireRemoteData}
                                    patient={patientResponse}
                                    setBatchRequest={setBatchRequest}
                                    setQuestionnaireResponse={setQuestionnaireResponse}
                                />
                            )}
                        </RenderRemoteData>
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow cssClass={s.lowerRowContainer}>
                    <ExpandableElement
                        title="QuestionnaireResonse FHIR resource"
                        cssClass={s.questionnaireResponseFHIRResourceBox}
                    >
                        <ResourceDisplayBox resourceResponse={success(questionnaireResponse)} />
                    </ExpandableElement>
                    <ExpandableElement title="Patient JUTE Mapping" cssClass={s.patientMapperBox}>
                        <RenderRemoteData remoteData={questionnaireRemoteData}>
                            {(questionnaire) => {
                                return (
                                    <>
                                        <MappingChoice
                                            mappingIdList={_.map(questionnaire.mapping, ({ id }) => id!)}
                                            mappingId={mappingId}
                                            setMappingId={setMappingId}
                                        />
                                        {mappingId && <MappingBox mappingId={mappingId} reload={reload} />}
                                    </>
                                );
                            }}
                        </RenderRemoteData>
                    </ExpandableElement>
                    <ExpandableElement title="Patient batch request" cssClass={s.patientBatchRequestBox}>
                        <RenderRemoteData remoteData={questionnaireRemoteData}>
                            {(questionnaire) => (
                                <PatientBatchRequestBox
                                    batchRequest={batchRequest}
                                    questionnaireResponse={questionnaireResponse}
                                    questionnaire={questionnaire}
                                />
                            )}
                        </RenderRemoteData>
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <Menu />
            <Logo />
        </>
    );
}

interface ExpandableElementProps {
    cssClass: string;
    title: string;
    children: React.ReactElement;
}

function ExpandableElement(props: ExpandableElementProps) {
    const [expanded, setExpanded] = useState(false);
    return (
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2 onClick={() => setExpanded((f) => !f)}>{props.title}</h2>
            {props.children}
        </div>
    );
}

interface ExpandableRowProps {
    cssClass: string;
    children: Array<React.ReactElement>;
}

function ExpandableRow(props: ExpandableRowProps) {
    const [expanded, setExpanded] = useState(false);
    const symbol = expanded ? arrowDown('#597EF7') : arrowUp('#597EF7');
    return (
        <div className={props.cssClass} style={expanded ? { flex: 4 } : {}}>
            <h2 style={{ position: 'absolute' }} onClick={() => setExpanded((f) => !f)}>
                {symbol}
            </h2>
            {props.children}
        </div>
    );
}
