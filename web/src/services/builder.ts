import { service } from 'fhir-react';

import { aiQuestionnaireBuilderUrl } from 'shared/src/constants';

import { getToken } from './auth';

export async function generateQuestionnaireService(prompt: string, questionnaire?: string) {
    const appToken = getToken();

    return await service<any>({
        baseURL: aiQuestionnaireBuilderUrl,
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
        baseURL: aiQuestionnaireBuilderUrl,
        url: `/mapper`,
        method: 'POST',
        data: { prompt: prompt, questionnaire },
        headers: {
            Authorization: `Bearer ${appToken}`,
        },
    });
}
