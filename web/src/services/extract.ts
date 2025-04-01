import { Mapping } from '@beda.software/aidbox-types';
import { Bundle, Questionnaire, QuestionnaireResponse, Parameters, FhirResource } from 'fhir/r4b';
import _ from 'lodash';

import { service } from 'fhir-react/lib/services/service';


import { juteURL, fhirpathMappingUrl } from './initialize';

interface Props {
    mapping: Mapping;
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
    launchContext: Parameters;
}

export async function extract(props: Props) {
    const { mapping, questionnaire, questionnaireResponse, launchContext } = props;

    const params = _.chain(launchContext.parameter)
        .map((p) => [p.name, p.resource])
        .fromPairs()
        .value();

    return await service<Bundle<FhirResource>>({
        baseURL: mapping.type === 'FHIRPath' ? fhirpathMappingUrl : juteURL,
        url: `/parse-template`,
        method: 'POST',
        data: {
            template: mapping.body,
            context: {
                Questionnaire: questionnaire,
                QuestionnaireResponse: questionnaireResponse,
                ...params,
            },
        },
    });
}

export async function applyMapping(bundle: Bundle<FhirResource>) {
    return await service({
        method: 'POST',
        url: `/`,
        data: bundle,
    });
}
