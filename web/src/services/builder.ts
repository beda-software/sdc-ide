import { service } from './fhir';

import { configuration } from 'shared/src/constants';

import { getToken } from './auth';

export async function generateQuestionnaireService(prompt: string, questionnaire?: string) {
    const appToken = getToken();

    return await service<any>({
        baseURL: configuration.aiQuestionnaireBuilderUrl,
        url: `/questionnaire`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}

export async function generateMappingService(prompt: string, questionnaire: string) {
    const appToken = getToken();

    return await service<any>({
        baseURL: configuration.aiQuestionnaireBuilderUrl,
        url: `/mapper`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
