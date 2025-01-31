import {
    Questionnaire as FHIRQuestionnaire,
    QuestionnaireResponse as FHIRQuestionnaireResponse,
} from 'fhir/r4b';

import {
    Questionnaire as FCEQuestionnaire,
    QuestionnaireResponse as FCEQuestionnaireResponse,
} from 'shared/src/contrib/aidbox';

import { convertQuestionnaire } from './questionnaire';
import { convertQuestionnaireResponse } from './questionnaireResponse';

export function fromFirstClassExtension(
    fceQuestionnaireResponse: FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse;
export function fromFirstClassExtension(fceQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtension(
    fceResource: FCEQuestionnaire | FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse | FHIRQuestionnaire {
    switch (fceResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fceResource);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fceResource);
    }
}

export function fromFirstClassExtensionV2(
    fceQuestionnaireResponse: FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse;
export function fromFirstClassExtensionV2(fceQuestionnaire: FCEQuestionnaire): FHIRQuestionnaire;
export function fromFirstClassExtensionV2(
    fceResource: FCEQuestionnaire | FCEQuestionnaireResponse,
): FHIRQuestionnaireResponse | FHIRQuestionnaire {
    switch (fceResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fceResource, true);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fceResource);
    }
}
