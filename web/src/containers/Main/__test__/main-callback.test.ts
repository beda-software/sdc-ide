import { renderHook, act } from '@testing-library/react-hooks';
import { ensure, withRootAccess } from 'aidbox-react/lib/utils/tests';

import { service } from 'aidbox-react/lib/services/service';

import { useMain } from 'src/containers/Main/hooks';

import patientTest1 from './resources/Patient/test-1.json';
import mappingTest1 from './resources/Mapping/test-1.json';
import mappingTest2 from './resources/Mapping/test-2.json';
import questionnaireTest1 from './resources/Questionnaire/test-1.json';
import questionnaireTest1FHIRUpdated from './resources/Questionnaire/test-1-fhir-updated.json';
import questionnaireTest2 from './resources/Questionnaire/test-2.json';
import questionnaireTest3 from './resources/Questionnaire/test-3.json';
import { Questionnaire } from 'shared/lib/contrib/aidbox';

const newQuest: Questionnaire = questionnaireTest1FHIRUpdated as Questionnaire;

const questionnaireId = 'test-1';
const patRef1 = { resourceType: 'Patient', id: 'test-1' };
const mapRef1 = { resourceType: 'Mapping', id: 'test-1' };
const mapRef2 = { resourceType: 'Mapping', id: 'test-2' };
const questRef1 = { resourceType: 'Questionnaire', id: 'test-1' };
const questRef2 = { resourceType: 'Questionnaire', id: 'test-2' };
const questRef3 = { resourceType: 'Questionnaire', id: 'test-3' };

async function setup() {
    const response = await withRootAccess(async () =>
        service({
            method: 'PUT',
            url: '',
            data: [
                patientTest1,
                mappingTest1,
                mappingTest2,
                questionnaireTest1,
                questionnaireTest2,
                questionnaireTest3,
            ],
        }),
    );
    return response;
}

test('saveQuestionnaireFHIR', async () => {
    await setup();
    await withRootAccess(async () => {
        const { result, waitFor } = renderHook(() => useMain(questionnaireId));

        await waitFor(() => {
            ensure(result.current.questionnaireRD);
        });
        await act(async () => {
            await result.current.saveQuestionnaireFHIR(newQuest);
        });
        await waitFor(() => {
            const qUpdated = ensure(result.current.questionnaireRD);
            expect(qUpdated.item?.[0].text).toBe('First Name 1');
        });
    });
});
