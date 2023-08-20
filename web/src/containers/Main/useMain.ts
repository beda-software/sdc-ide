import {
    Questionnaire,
    QuestionnaireResponse,
    Parameters,
    ParametersParameter,
    Bundle,
    FhirResource,
} from 'fhir/r4b';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { applyMapping as applyMappingService, extract } from 'web/src/services/extract';

import {
    createFHIRResource as createAidboxFHIRResource,
    getFHIRResource as getAidboxFHIRResource,
    saveFHIRResource as saveAidboxFHIRResource,
} from 'aidbox-react/lib/services/fhir';

import { useService } from 'fhir-react/lib/hooks/service';
import {
    RemoteData,
    failure,
    isFailure,
    isSuccess,
    notAsked,
    success,
} from 'fhir-react/lib/libs/remoteData';
import { WithId, saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { service } from 'fhir-react/lib/services/service';
import { formatError } from 'fhir-react/lib/utils/error';

import { Mapping } from 'shared/src/contrib/aidbox';

import { getMappings, makeMappingExtension } from './utils';

export function useLaunchContext() {
    const [launchContext, setLaunchContext] = useState<Parameters>({
        resourceType: 'Parameters',
        parameter: [],
    });

    const updateLaunchContext = (parameter: ParametersParameter) => {
        setLaunchContext((parameters) => ({
            ...parameters,
            parameter: [
                ...(parameters.parameter?.filter((p) => p.name !== parameter.name) || []),
                parameter,
            ],
        }));
    };

    const removeLaunchContext = (parameter: ParametersParameter) => {
        setLaunchContext((parameters) => ({
            ...parameters,
            parameter: [...(parameters.parameter?.filter((p) => p.name !== parameter.name) || [])],
        }));
    };

    return { launchContext, setLaunchContext: updateLaunchContext, removeLaunchContext };
}

export function useMain(questionnaireId: string) {
    const { launchContext, setLaunchContext, removeLaunchContext } = useLaunchContext();

    const [mappingRD, setMappingRD] = useState<RemoteData<WithId<Mapping>>>(notAsked);
    const loadMapping = useCallback(async (q: Questionnaire) => {
        const mappings =
            getMappings(q)?.map((ext) => ext.valueReference!.reference!.split('/')[1]!) || [];

        const response = await getAidboxFHIRResource<Mapping>({
            resourceType: 'Mapping',
            id: mappings[0]!,
        });

        setMappingRD(response);
    }, []);
    const reloadMapping = useCallback(async () => {
        if (isSuccess(mappingRD)) {
            const response = await getAidboxFHIRResource<Mapping>({
                resourceType: 'Mapping',
                id: mappingRD.data.id,
            });

            setMappingRD(response);
        }
    }, [mappingRD]);

    const [originalQuestionnaireRD, originalQuestionnaireRDManager] = useService(async () => {
        const response = await service<Questionnaire>({
            method: 'GET',
            url: `Questionnaire/${questionnaireId}`,
        });

        if (isSuccess(response)) {
            setLaunchContext({ name: 'questionnaire', resource: response.data });
            loadMapping(response.data);
        }

        return response;
    }, [questionnaireId]);

    const [assembledQuestionnaireRD, assembledQuestionnaireRDManager] = useService(async () => {
        const response = await service<Questionnaire>({
            method: 'GET',
            url: `Questionnaire/${questionnaireId}/$assemble`,
        });

        return response;
    }, [questionnaireId]);

    const reloadQuestionnaire = useCallback(async () => {
        originalQuestionnaireRDManager.reload();
        assembledQuestionnaireRDManager.reload();
    }, [originalQuestionnaireRDManager, assembledQuestionnaireRDManager]);

    const saveQuestionnaire = useCallback(
        async (questionnaire: Questionnaire) => {
            const response = await saveFHIRResource(questionnaire);

            if (isSuccess(response)) {
                originalQuestionnaireRDManager.set(response.data);
                setLaunchContext({ name: 'questionnaire', resource: response.data });
                assembledQuestionnaireRDManager.reload();

                toast.success(
                    `The ${
                        response.data.title || response.data.id
                    } Questionnaire successfully updated`,
                );
            }

            if (isFailure(response)) {
                toast.error(formatError(response.error));
            }

            return response;
        },
        [originalQuestionnaireRDManager, assembledQuestionnaireRDManager, setLaunchContext],
    );

    const [questionnaireResponseRD, questionnaireResponseRDManager] = useService(async () => {
        const response = await service<QuestionnaireResponse>({
            method: 'POST',
            url: '/Questionnaire/$populate',
            data: launchContext,
        });

        return response;
    }, [launchContext]);

    const addMapping = useCallback(
        async (mapping: Mapping) => {
            const mappingResponse = await createAidboxFHIRResource(mapping);

            if (isSuccess(mappingResponse) && isSuccess(originalQuestionnaireRD)) {
                const questionnaire = originalQuestionnaireRD.data;
                const updatedQuestionnaire = {
                    ...questionnaire,
                    extension: [
                        ...(questionnaire.extension || []),
                        makeMappingExtension(mapping.id!),
                    ],
                };
                const qResponse = await saveFHIRResource(updatedQuestionnaire);

                if (isSuccess(qResponse)) {
                    originalQuestionnaireRDManager.set(qResponse.data);
                    setMappingRD(success(mappingResponse.data));
                }

                return qResponse;
            }

            return mappingResponse;
        },
        [originalQuestionnaireRD, originalQuestionnaireRDManager],
    );

    const saveMapping = useCallback(
        async (mapping: Mapping) => {
            const response = await saveAidboxFHIRResource(mapping);

            if (isSuccess(response)) {
                setMappingRD(response);

                toast.success(`The ${response.data.id} Mapping successfully updated`);
            }

            if (isFailure(response)) {
                toast.error(formatError(response.error));
            }

            return response;
        },
        [setMappingRD],
    );

    const [extractRD] = useService<Bundle<FhirResource>>(async () => {
        if (
            isSuccess(assembledQuestionnaireRD) &&
            isSuccess(questionnaireResponseRD) &&
            isSuccess(mappingRD)
        ) {
            return await extract({
                questionnaire: assembledQuestionnaireRD.data,
                questionnaireResponse: questionnaireResponseRD.data,
                mapping: mappingRD.data,
                launchContext: launchContext,
            });
        } else {
            return await Promise.resolve(
                failure({
                    resourceType: 'OperationOutcome',
                    issue: [
                        {
                            severity: 'error',
                            code: 'provide-extract-context',
                            diagnostics:
                                'Provide Questionnaire, QuestionnaireResponse and Mapping to see extracted resources',
                        },
                    ],
                }),
            );
        }
    }, [assembledQuestionnaireRD, questionnaireResponseRD, mappingRD, launchContext]);

    const applyMapping = useCallback(async (bundle: Bundle<FhirResource>) => {
        const response = await applyMappingService(bundle);

        if (isSuccess(response)) {
            toast.success(`The Mapping successfully applied`, { autoClose: false });
        }
    }, []);

    return {
        launchContext,
        originalQuestionnaireRD,
        assembledQuestionnaireRD,
        questionnaireResponseRD,
        mappingRD,
        extractRD,
        manager: {
            saveQuestionnaire,
            reloadQuestionnaire,
            setQuestionnaireResponse: questionnaireResponseRDManager.set,
            setLaunchContext,
            removeLaunchContext,
            reloadMapping,
            addMapping,
            setMapping: (m: WithId<Mapping>) => setMappingRD(success(m)),
            applyMapping,
            saveMapping,
        },
    };
}
