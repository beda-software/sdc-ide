import {
    BaseRenderer,
    RendererThemeProvider,
    useBuildForm,
    useRendererQueryClient
} from '@aehrc/smart-forms-renderer';
import { QueryClientProvider } from '@tanstack/react-query';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';
import { formatError } from 'fhir-react/lib/utils/error';


import { sequenceMap } from 'fhir-react/lib/services/service';
import { QRFormWrapperProps } from "../Main/types";
import { Questionnaire } from 'fhir/r4';



interface YourBaseRendererWrapperProps {
    questionnaire: Questionnaire;
}

function YourBaseRendererWrapper(props: YourBaseRendererWrapperProps) {
    const { questionnaire } = props;

    // The renderer needs a query client to make API calls
    const queryClient = useRendererQueryClient();

    // This hook builds the form based on the questionnaire
    const isBuilding = useBuildForm(questionnaire);

    if (isBuilding) {
        return <div>Loading...</div>;
    }

    return (
        <RendererThemeProvider>
            <QueryClientProvider client={queryClient}>
                <BaseRenderer />
            </QueryClientProvider>
        </RendererThemeProvider>
    );
}

export function AEHRCFormWrapper({
    questionnaireRD,
    questionnaireResponseRD,
}: QRFormWrapperProps) {
    const remoteDataResult = sequenceMap({
        questionnaireRD,
        questionnaireResponseRD,
    });

    return (
        <RenderRemoteData
            remoteData={remoteDataResult}
            renderFailure={(errors: Error[]) => {
                return <p>{errors.map((e) => formatError(e)).join(',')}</p>;
            }}
        >
            {(data) => (<YourBaseRendererWrapper questionnaire={data.questionnaireRD as Questionnaire} />)}
        </RenderRemoteData>);
}
