import { useService, WithId , formatError } from '@beda.software/fhir-react';
import {
    RemoteData,
    RemoteDataResult,
    failure,
    isFailure,
    isSuccess,
    notAsked,
    success,
} from '@beda.software/remote-data';
import { Questionnaire, Parameters, ParametersParameter, Bundle, FhirResource } from 'fhir/r4b';
import { useCallback, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { generateMappingService, generateQuestionnaireService } from 'web/src/services/builder';
import { applyMapping as applyMappingService, extract } from 'web/src/services/extract';
import { service, saveFHIRResource } from 'web/src/services/fhir';

import {
    createFHIRResource as createAidboxFHIRResource,
    getFHIRResource as getAidboxFHIRResource,
    saveFHIRResource as saveAidboxFHIRResource,
} from 'aidbox-react/lib/services/fhir';

// import { WithId, saveFHIRResource } from 'fhir-react/lib/services/fhir';
// import { service } from 'fhir-react/lib/services/service';

import { Mapping } from 'shared/src/contrib/aidbox';

import { SDCContext } from './context';
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

    const clearLaunchContext = (parameter: ParametersParameter) => {
        setLaunchContext((parameters) => ({
            ...parameters,
            parameter: [...(parameters.parameter?.filter((p) => p.name !== parameter.name) || [])],
        }));
    };

    return { launchContext, setLaunchContext: updateLaunchContext, clearLaunchContext };
}

export function useMain(questionnaireId: string) {
    const navigate = useNavigate();
    const { assemble, populate } = useContext(SDCContext);
    const { launchContext, setLaunchContext, clearLaunchContext } = useLaunchContext();

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

    const [assembledQuestionnaireRD, assembledQuestionnaireRDManager] = useService(
        () => assemble(questionnaireId),
        [questionnaireId, assemble],
    );

    const reloadQuestionnaire = useCallback(async () => {
        originalQuestionnaireRDManager.reload();
        assembledQuestionnaireRDManager.reload();
    }, [originalQuestionnaireRDManager, assembledQuestionnaireRDManager]);

    const saveQuestionnaire = useCallback(
        async (questionnaire: Questionnaire): Promise<RemoteDataResult<WithId<Questionnaire>>> => {
            const response = await saveFHIRResource(questionnaire);

            if (isSuccess(response)) {
                originalQuestionnaireRDManager.set(response.data);
                setLaunchContext({ name: 'questionnaire', resource: response.data });
                assembledQuestionnaireRDManager.reload();

                toast.success(
                    `The ${response.data.title || response.data.id} Questionnaire successfully ${
                        questionnaire.id ? 'updated' : 'created'
                    } `,
                );
            }

            if (isFailure(response)) {
                toast.error(formatError(response.error), { autoClose: false });
            }

            return response;
        },
        [originalQuestionnaireRDManager, assembledQuestionnaireRDManager, setLaunchContext],
    );

    const generateQuestionnaire = useCallback(
        async (prompt: string): Promise<RemoteDataResult<any>> => {
            const initialQuestionnaire: Questionnaire = {
                resourceType: 'Questionnaire',
                status: 'draft',
                meta: {
                    profile: ['https://beda.software/beda-emr-questionnaire'],
                },
            };
            const response = await generateQuestionnaireService(
                prompt,
                JSON.stringify(initialQuestionnaire),
            );
            console.log('generateQuestionnaire response', response);

            if (isSuccess(response)) {
                const newQuestionnaire = response.data;
                const qResponse = await saveQuestionnaire(newQuestionnaire);

                if (isSuccess(qResponse)) {
                    navigate(`/${qResponse.data.id}`);
                }

                if (isFailure(qResponse)) {
                    return qResponse;
                }
            }

            if (isFailure(response)) {
                toast.error(formatError(response.error), { autoClose: false });
            }

            return response;
        },
        [saveQuestionnaire, navigate],
    );

    const [questionnaireResponseRD, questionnaireResponseRDManager] = useService(
        () => populate(launchContext),
        [launchContext, populate],
    );

    const createMapping = useCallback(
        async (mapping: Mapping) => {
            const mappingResponse = await createAidboxFHIRResource(mapping);

            if (isSuccess(mappingResponse) && isSuccess(originalQuestionnaireRD)) {
                const questionnaire = originalQuestionnaireRD.data;
                const updatedQuestionnaire = {
                    ...questionnaire,
                    extension: [
                        ...(questionnaire.extension || []),
                        makeMappingExtension(mappingResponse.data.id!),
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

    const generateMapping = useCallback(
        async (prompt: string): Promise<RemoteDataResult<any>> => {
            if (isSuccess(originalQuestionnaireRD)) {
                const response = await generateMappingService(
                    prompt,
                    JSON.stringify(originalQuestionnaireRD.data),
                );
                console.log('generateMapping response', response);

                if (isSuccess(response)) {
                    let newMapping = response.data;
                    if (newMapping.resourceType !== 'Mapping') {
                        newMapping = {
                            resourceType: 'Mapping',
                            body: newMapping,
                            type: 'FHIRPath',
                        };
                    }
                    const mResponse = await createMapping(newMapping);

                    if (isFailure(mResponse)) {
                        return mResponse;
                    }
                }

                if (isFailure(response)) {
                    toast.error(formatError(response.error), { autoClose: false });
                }

                return response;
            }

            return await Promise.resolve(failure(originalQuestionnaireRD));
        },
        [createMapping, originalQuestionnaireRD],
    );

    const saveMapping = useCallback(
        async (mapping: Mapping) => {
            const response = await saveAidboxFHIRResource(mapping);

            if (isSuccess(response)) {
                setMappingRD(response);

                toast.success(`The ${response.data.id} Mapping successfully updated`);
            }

            if (isFailure(response)) {
                toast.error(formatError(response.error), { autoClose: false });
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
            toast.success(`The Mapping successfully applied`);
        }

        if (isFailure(response)) {
            toast.error(formatError(response.error), { autoClose: false });
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
            generateQuestionnaire,
            setQuestionnaireResponse: questionnaireResponseRDManager.set,
            setLaunchContext,
            clearLaunchContext,
            reloadMapping,
            createMapping,
            setMapping: (m: WithId<Mapping>) => setMappingRD(success(m)),
            applyMapping,
            saveMapping,
            generateMapping,
        },
    };
}
