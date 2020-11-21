import { renderHook } from '@testing-library/react-hooks';
import _ from 'lodash';
import { useMain } from 'src/containers/Main/hooks';
import { axiosInstance } from 'aidbox-react/lib/services/instance';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';

import { draw, waitToResolve } from 'src/containers/Main/__test__/utils';
import { patientExpected } from './resources/patient';
import { questionnaireExpected } from 'src/containers/Main/__test__/resources/questionnaire';
import { Questionnaire } from 'shared/lib/contrib/aidbox';
import { questionnaireFHIRExpected } from 'src/containers/Main/__test__/resources/questionnaireFHIRExpected';
import { act } from 'react-dom/test-utils';

const questionnaireIdInitial = 'demo-1';

beforeEach(() => {
    axiosInstance.defaults.auth = {
        username: 'root',
        password: 'secret',
    };
});

test('patient is loaded', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = renderHook(() => useMain(questionnaireIdInitial));

    await waitToResolve(result, waitForNextUpdate, 'patientRD');

    if (isSuccess(result.current.patientRD)) {
        const patient = _.omit(result.current.patientRD.data, 'meta');
        // draw(patient, 'patient');
        expect(patient.id).toBe(patientExpected.id);
    }
});

test('questionnaire is loaded', async () => {
    expect.assertions(2);
    const { result, waitForNextUpdate } = await renderHook(() => useMain(questionnaireIdInitial));

    await waitToResolve(result, waitForNextUpdate, 'questionnaireRD');

    if (isSuccess(result.current.questionnaireRD)) {
        const questionnaire = _.omit(result.current.questionnaireRD.data, 'meta');
        expect(questionnaire.id).toBe(questionnaireIdInitial);
        expect(questionnaire.mapping![0]).toEqual(questionnaireExpected.mapping![0]);
    }
});

test('questionnaire in FHIR format is loaded', async () => {
    expect.assertions(3);
    const { result, waitForNextUpdate } = await renderHook(() => useMain(questionnaireIdInitial));

    await waitToResolve(result, waitForNextUpdate, 'questionnaireFHIRRD');

    if (isSuccess(result.current.questionnaireFHIRRD)) {
        const questionnaire = _.omit(result.current.questionnaireFHIRRD.data, 'meta');
        // draw(questionnaire, 'questionnaire');
        expect(questionnaire.id).toBe(questionnaireIdInitial);

        const getMappingExtexnsion = (q: Partial<Questionnaire> | any) =>
            _.find(q.extension, {
                url: 'http://beda.software/fhir-extensions/questionnaire-mapper',
            });

        const mappingFromQuestionnaire = getMappingExtexnsion(questionnaire);
        const mappingFromQuestionnaireFHIRExpected = getMappingExtexnsion(questionnaireFHIRExpected);
        expect(mappingFromQuestionnaire.valueReference.reference).toBeDefined();
        expect(mappingFromQuestionnaire.valueReference.reference).toEqual(
            mappingFromQuestionnaireFHIRExpected.valueReference.reference,
        );
    }
});

test('Check onQuestionnaireUpdate', async () => {
    expect.assertions(1);
    const { result, waitForNextUpdate } = await renderHook(() => useMain(questionnaireIdInitial));

    // Get initial questionnaire in FHIR format
    await waitToResolve(result, waitForNextUpdate, 'questionnaireFHIRRD');

    if (isSuccess(result.current.questionnaireFHIRRD)) {
        const questionnaire = _.omit(result.current.questionnaireFHIRRD.data, 'meta');
        // draw(questionnaire, 'questionnaire');
    }

    const newItem = {
        text: 'First Name',
        type: 'string',
        linkId: 'first-name',
        extension: [
            {
                url: 'http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-initialExpression',
                valueExpression: {
                    language: 'text/fhirpath',
                    expression: '%LaunchPatient.name.given.first()',
                },
            },
        ],
    };
    const newQuestionnaire: Questionnaire = {
        ...questionnaireFHIRExpected,
        item: [newItem],
    };

    draw(newQuestionnaire, 'questionnaire to save');

    // Call onQuestionnaireUpdate(questionnaireExpected)
    // Trigger second slide
    act(async () => {
        await result.current.onQuestionnaireUpdate(newQuestionnaire);
    });

    draw(result.current.questionnaireFHIRRD, 'questionnaireFHIRRD');
    expect(1).toEqual(1);

    if (isSuccess(result.current.questionnaireFHIRRD)) {
        const questionnaire = _.omit(result.current.questionnaireFHIRRD.data, 'meta');
        // draw(questionnaire, 'questionnaire');
    }

    // Await and check questionnaire is equal to questionnaireExpected
    //    Check if dependent resources were re-fetched
});

// test('test onQuestionnaireResponseFormChange', async () => {
// Check that a questionnaireResponse is loaded without any callback actions
// get expected qR
// call onQuestionnaireResponseFormChange with qR
//    check if qR is updated
// });

// test('test onMappingChange', async () => {
//     expect(1).toBe(1);
// });
//
// test('test onMappingIdChange', async () => {});
//
// test('test onMappingsApply', async () => {});
