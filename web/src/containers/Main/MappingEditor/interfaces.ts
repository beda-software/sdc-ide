import { Questionnaire, Parameters, QuestionnaireResponse } from "fhir/r4b";

import { RemoteData, RemoteDataResult } from "fhir-react/lib/libs/remoteData";
import { WithId } from "fhir-react/lib/services/fhir";

import { Mapping } from "shared/src/contrib/aidbox";

interface CommonMappingEditorProps {
    onSave: (resource: WithId<Mapping>) => void;
    onChange: (resource: WithId<Mapping>) => void;
    reload: () => void;
    createMapping: (mapping: Mapping) => Promise<RemoteData<any>>;
    generateMapping: (prompt: string) => Promise<RemoteDataResult<any>>;
    toggleMappingMode: () => void;
}

export interface MappingEditorProps extends CommonMappingEditorProps {
    questionnaireRD: RemoteData<Questionnaire>;
    mappingRD: RemoteData<WithId<Mapping>>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
}

export interface MappingEditorErrorProps {
    showSelect: boolean;
    setShowSelect: (value: boolean) => void;
    error: any;
}

export interface MappingEditorSelectProps extends CommonMappingEditorProps {
    mappingsRD: RemoteData<WithId<Mapping>[], any>;
    mappingRD: RemoteData<WithId<Mapping>>;
    showModal: boolean;
    setShowSelect: (value: boolean) => void;
    setShowModal: (value: boolean) => void;
}

export interface MappingEditorEditorProps extends CommonMappingEditorProps {
    setShowSelect: (value: boolean) => void;
    updatedResource: WithId<Mapping> | undefined;
    setUpdatedResource: (value: WithId<Mapping> | undefined) => void;
    mapping: WithId<Mapping>;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
}
