import { Questionnaire as FHIRQuestionnaire } from 'fhir/r4b';
import cloneDeep from 'lodash/cloneDeep';

import { Questionnaire as FCEQuestionnaire } from 'shared/src/contrib/aidbox';

import { processExtensions } from './processExtensions';
import { processItems } from './processItems';
import { processMeta } from './processMeta';

export function convertQuestionnaire(
    questionnaire: FCEQuestionnaire,
    onlyExtensions = false,
): FHIRQuestionnaire {
    questionnaire = cloneDeep(questionnaire);
    if (!onlyExtensions) {
        questionnaire.meta = questionnaire.meta
            ? processMeta(questionnaire.meta)
            : questionnaire.meta;
    }
    questionnaire.item = processItems(questionnaire.item ?? [], onlyExtensions);
    return processExtensions(questionnaire) as FHIRQuestionnaire;
}
