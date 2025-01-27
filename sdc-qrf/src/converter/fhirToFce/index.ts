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

export function toFirstClassExtension(
    fhirQuestionnaireResponse: FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse;
export function toFirstClassExtension(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtension(
    fhirResource: FHIRQuestionnaire | FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse | FCEQuestionnaire {
    switch (fhirResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fhirResource, false);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fhirResource);
    }
}

export function toFirstClassExtensionV2(
    fhirQuestionnaireResponse: FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse;
export function toFirstClassExtensionV2(fhirQuestionnaire: FHIRQuestionnaire): FCEQuestionnaire;
export function toFirstClassExtensionV2(
    fhirResource: FHIRQuestionnaire | FHIRQuestionnaireResponse,
): FCEQuestionnaireResponse | FCEQuestionnaire {
    // The new versions does not convert unions and references
    // NOTE: The return type in that case is not fully compatible with Aidbox Questionnaire
    switch (fhirResource.resourceType) {
        case 'Questionnaire':
            return convertQuestionnaire(fhirResource, true);
        case 'QuestionnaireResponse':
            return convertQuestionnaireResponse(fhirResource);
    }
}
