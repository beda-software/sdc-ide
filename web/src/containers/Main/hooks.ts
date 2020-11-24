import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResource, saveFHIRResource } from 'aidbox-react/lib/services/fhir';
import { Bundle, Mapping, Parameters, Patient, Questionnaire, QuestionnaireResponse } from 'shared/lib/contrib/aidbox';
import { service, sequenceMap } from 'aidbox-react/lib/services/service';
import { isSuccess, notAsked, RemoteData, loading, success } from 'aidbox-react/lib/libs/remoteData';
import React, { useCallback, useEffect, useState } from 'react';
import _ from 'lodash';

export function useMain(questionnaireId: string) {
    // Patient
    const patientId = 'patient'; // One patient across all questionnaires

    const [patientRD] = useService(
        () =>
            getFHIRResource<Patient>({
                resourceType: 'Patient',
                id: patientId,
            }),
        [patientId, questionnaireId],
    );

    // Questionnaire
    const [questionnaireRD, questionnaireManager] = useService(async () => {
        const response = await service<Questionnaire>({
            method: 'GET',
            url: `Questionnaire/${questionnaireId}/$assemble`,
        });

        if (isSuccess(response)) {
            const mappings = response.data.mapping || [];
            setMappingList(_.sortBy(mappings, 'id'));
            const firstMapping = mappings.length ? mappings[0] : undefined;
            setActiveMappingId(firstMapping?.id);
        }

        return response;
    }, [questionnaireId]);

    // Questionnaire in FHIR format
    const [questionnaireFHIRRD] = useService(
        () =>
            service<Questionnaire>({
                method: 'GET',
                url: `/fhir/Questionnaire/${questionnaireId}`,
            }),
        [questionnaireId],
    );

    const saveQuestionnaireFHIR = async (resource: Questionnaire) => {
        // todo: use callback
        const response = await service({
            method: 'PUT',
            data: resource,
            url: `/fhir/Questionnaire/${resource.id}`,
        });
        if (isSuccess(response)) {
            questionnaireManager.reload();
        } else {
            console.error('Could not save Questionnaire:', response.error.toString());
        }
    };

    const [questionnaireResponse, setQuestionnaireResponse] = useState<RemoteData<QuestionnaireResponse>>(loading);

    const loadQuestionnaireResponse = useCallback(async () => {
        if (isSuccess(patientRD) && isSuccess(questionnaireRD)) {
            const params: Parameters = {
                resourceType: 'Parameters',
                parameter: [
                    { name: 'LaunchPatient', resource: patientRD.data },
                    { name: 'questionnaire', resource: questionnaireRD.data },
                ],
            };
            const response = await service<QuestionnaireResponse>({
                method: 'POST',
                url: '/Questionnaire/$populate',
                data: params,
            });
            if (isSuccess(response)) {
                console.log('set QR after populate');
                setQuestionnaireResponse(response);
            }
        }
    }, [patientRD, questionnaireRD]);

    const saveQuestionnaireResponse = (resource: QuestionnaireResponse) => {
        if (!_.isEqual(resource, questionnaireResponse)) {
            console.log('set QR saveQR');
            setQuestionnaireResponse(success(resource));
        }
    };

    useEffect(() => {
        (async () => {
            const loadingStatus = sequenceMap({ patientRD, questionnaireRD });
            if (isSuccess(loadingStatus)) {
                await loadQuestionnaireResponse();
            } else {
                setQuestionnaireResponse(loadingStatus);
            }
        })();
    }, [patientRD, questionnaireRD, loadQuestionnaireResponse]);

    // MappingList
    const [mappingList, setMappingList] = useState<Mapping[]>([]);

    // Active mapping id
    const [activeMappingId, setActiveMappingId] = useState<string | undefined>();

    // Mapping
    const [mappingRD, setMappingRD] = useState<RemoteData<Mapping>>(notAsked);

    const loadMapping = useCallback(async () => {
        const response = await getFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: activeMappingId,
        });
        setMappingRD(response);
    }, [activeMappingId]);

    useEffect(() => {
        (async () => {
            if (activeMappingId) {
                await loadMapping();
            }
        })();
    }, [activeMappingId, loadMapping]);

    const saveMapping = async (mapping: Mapping) => {
        if (isSuccess(mappingRD)) {
            if (!_.isEqual(mapping, mappingRD.data)) {
                const response = await saveFHIRResource(mapping);
                if (isSuccess(response)) {
                    await loadMapping();
                }
            }
        }
    };

    // BatchRequest
    const [batchRequestRD, setBatchRequestRD] = React.useState<RemoteData<Bundle<any>>>(notAsked);

    useEffect(() => {
        (async function () {
            if (activeMappingId) {
                const response = await service({
                    method: 'POST',
                    url: `/Mapping/${activeMappingId}/$debug`,
                    data: questionnaireResponse,
                });
                setBatchRequestRD(response);
            }
        })();
    }, [questionnaireResponse, activeMappingId]);

    // Mapping apply
    const applyMappings = async () => {
        if (isSuccess(questionnaireRD)) {
            const response = await service({
                method: 'POST',
                url: '/Questionnaire/$extract',
                data: {
                    resourceType: 'Parameters',
                    parameter: [
                        { name: 'questionnaire_response', resource: questionnaireResponse },
                        { name: 'questionnaire', resource: questionnaireRD.data },
                    ],
                },
            });
            if (isSuccess(response)) {
                window.location.reload();
            }
        }
    };

    return {
        patientRD,
        questionnaireRD,
        questionnaireFHIRRD,
        saveQuestionnaireFHIR,
        questionnaireResponse,
        saveQuestionnaireResponse,
        mappingList,
        activeMappingId,
        setActiveMappingId,
        mappingRD,
        saveMapping,
        batchRequestRD,
        applyMappings,
    };
}
