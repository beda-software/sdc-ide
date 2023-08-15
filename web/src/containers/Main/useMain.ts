import {
    Questionnaire,
    QuestionnaireResponse,
    Parameters,
    ParametersParameter,
    Bundle,
    FhirResource,
} from 'fhir/r4b';
import { useCallback, useState } from 'react';
import { extract } from 'web/src/services/extract';

import {
    createFHIRResource as createAidboxFHIRResource,
    getFHIRResource as getAidboxFHIRResource,
} from 'aidbox-react/lib/services/fhir';

import { useService } from 'fhir-react/lib/hooks/service';
import { failure, isSuccess } from 'fhir-react/lib/libs/remoteData';
import { saveFHIRResource } from 'fhir-react/lib/services/fhir';
import { service } from 'fhir-react/lib/services/service';

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

    const [originalQuestionnaireRD, originalQuestionnaireRDManager] = useService(async () => {
        const response = await service<Questionnaire>({
            method: 'GET',
            url: `Questionnaire/${questionnaireId}`,
        });

        if (isSuccess(response)) {
            setLaunchContext({ name: 'questionnaire', resource: response.data });
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
                assembledQuestionnaireRDManager.reload();
            }

            return response;
        },
        [originalQuestionnaireRDManager, assembledQuestionnaireRDManager],
    );

    const [questionnaireResponseRD, questionnaireResponseRDManager] = useService(async () => {
        const response = await service<QuestionnaireResponse>({
            method: 'POST',
            url: '/Questionnaire/$populate',
            data: launchContext,
        });

        return response;
    }, [launchContext]);

    const [mappingRD, mappingRDManager] = useService<Mapping>(async () => {
        if (isSuccess(originalQuestionnaireRD)) {
            const mappings =
                getMappings(originalQuestionnaireRD.data)?.map(
                    (ext) => ext.valueReference!.reference!.split('/')[1]!,
                ) || [];

            return await getAidboxFHIRResource<Mapping>({
                resourceType: 'Mapping',
                id: mappings[0]!,
            });
        } else {
            return await Promise.resolve(
                failure({
                    resourceType: 'OperationOutcome',
                    issue: [
                        {
                            severity: 'error',
                            code: 'provide-questionnaire',
                            diagnostics: 'Provide Questionnaire to see Mapping',
                        },
                    ],
                }),
            );
        }
    }, [originalQuestionnaireRD]);

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
                    mappingRDManager.set(mapping);
                }
            }
        },
        [originalQuestionnaireRD, mappingRDManager, originalQuestionnaireRDManager],
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
            reloadMapping: mappingRDManager.reload,
            addMapping,
            setMapping: mappingRDManager.set,
        },
    };
}
