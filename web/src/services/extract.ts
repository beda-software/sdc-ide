import { Bundle, Questionnaire, QuestionnaireResponse, Parameters } from 'fhir/r4b';
import _ from 'lodash';

import { service } from 'fhir-react/lib/services/service';

import { Mapping } from 'shared/src/contrib/aidbox';

import { juteURL } from './initialize';

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

    return await service<Bundle<any>>({
        baseURL: juteURL,
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
