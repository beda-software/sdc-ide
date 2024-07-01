import { Bundle, Questionnaire } from 'fhir/r4b';
import { useEffect, useState } from 'react';

import { getFHIRResources as getAidboxFHIRResources } from 'aidbox-react/lib/services/fhir';

import { useService, WithId, extractBundleResources} from '@beda.software/fhir-react';
import {
    RemoteData,
    RemoteDataResult,
    failure,
    isFailure,
    isLoading,
    isNotAsked,
    isSuccess,
    success,
    mapSuccess,
} from '@beda.software/remote-data';

import { Mapping } from 'shared/src/contrib/aidbox';

import { EditorState } from './interfaces';
import { getMappings } from '../utils';

export function useMappingEditor(
    questionnaireRD: RemoteData<Questionnaire>,
    mappingRD: RemoteData<Mapping>,
) {
    const [showModal, setShowModal] = useState(false);
    const [updatedResource, setUpdatedResource] = useState<WithId<Mapping> | undefined>();
    const [editorState, setEditorState] = useState<EditorState>('initial');

    const setEditorInitial = () => setEditorState('initial');
    const setEditorLoading = () => setEditorState('loading');
    const setEditorSelect = () => setEditorState('select');
    const setEditorReady = () => setEditorState('ready');

    useEffect(() => {
        if (isNotAsked(questionnaireRD)) {
            setEditorInitial();
        }
        if (isLoading(questionnaireRD)) {
            setEditorLoading();
        }

        if (isFailure(questionnaireRD)) {
            setEditorInitial();
        }

        if (isSuccess(questionnaireRD)) {
            if (isSuccess(mappingRD)) {
                setEditorReady();
            }
            if (isNotAsked(mappingRD)) {
                setEditorInitial();
            }
            if (isFailure(mappingRD)) {
                setEditorSelect();
            }
        }
    }, [questionnaireRD, mappingRD]);

    const [mappingsRD] = useService(async () => {
        if (isSuccess(questionnaireRD)) {
            let response: RemoteDataResult<Bundle<WithId<Mapping>>> = success({
                resourceType: 'Bundle',
                entry: [],
                type: 'searchset',
            });

            const ids =
                getMappings(questionnaireRD.data)?.map(
                    (ext) => ext.valueReference!.reference!.split('/')[1]!,
                ) || [];

            if (ids.length) {
                response = await getAidboxFHIRResources<Mapping>('Mapping', {
                    _sort: 'id',
                    _id: [ids.join(',')],
                });
            }

            return mapSuccess(response, (bundle) => extractBundleResources(bundle).Mapping);
        }

        return await Promise.resolve(failure({}));
    }, [questionnaireRD]);

    return {
        mappingsRD,
        setShowModal,
        showModal,
        updatedResource,
        setUpdatedResource,
        editorState,
        setEditorInitial,
        setEditorLoading,
        setEditorReady,
        setEditorSelect,
    };
}
