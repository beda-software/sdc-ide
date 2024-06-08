import { Bundle, QuestionnaireResponse, StructureMap } from "fhir/r4b";
import { useCallback, useEffect, useState } from "react";
import { convert, createStructureMap, transform } from "web/src/services/fhirmapping";

import { isSuccess } from "fhir-react/lib/libs/remoteData";


export function useFHIRMappingLanguage(questionnaireResponse: QuestionnaireResponse | undefined) {
    const [mapString, setMapString] = useState<string>('')
    const [prevMapString, setPrevMapString] = useState<string>('')
    const [structureMapData, setStructureMapData] = useState<StructureMap|undefined>(undefined)
    const [structureMap, setStructureMap] = useState<StructureMap|undefined>(undefined)
    const [structureMapUrl, setStructureMapUrl] = useState<string | undefined>(undefined)
    const [mappingResult, setMappingResult] = useState<Bundle | undefined>(undefined)

    const fetchConvertData = useCallback(async (mapString: string, prevMapString: string) => {
        if (mapString !== prevMapString){
            const response = await convert({ mapString });
            if (isSuccess(response)) {
                setStructureMapData(response.data);
            } else {
                setMappingResult(response.error)
            }
        }
    }, []);

    const fetchStructureMap = useCallback(async (structureMapData: StructureMap) => {
        const response = await createStructureMap({ structureMap: structureMapData });
        if (isSuccess(response)) {
            const structureMapResource = response.data;
            setStructureMap(structureMapResource);
            setStructureMapUrl(structureMapResource.url);
        }
    }, []);

    const fetchMappingResult = useCallback(async (structureMapUrl: string, questionnaireResponse: QuestionnaireResponse) => {
        const response = await transform({ structureMapUrl, questionnaireResponse });
        const dataToSet = isSuccess(response) ? response.data : response.error
        setMappingResult(dataToSet)
    }, []);

    useEffect(() => {
        if (mapString !== prevMapString) {
            fetchConvertData(mapString, prevMapString);
        }
    }, [mapString, fetchConvertData, prevMapString]);

    useEffect(() => {
        if (structureMapData) {
            fetchStructureMap(structureMapData);
        }
    }, [structureMapData, fetchStructureMap]);

    useEffect(() => {
        if (structureMapUrl && structureMap && questionnaireResponse) {
            fetchMappingResult(structureMapUrl, questionnaireResponse);
        }
    }, [structureMapUrl, questionnaireResponse, fetchMappingResult, structureMap]);

    const changeMapString = (value: string) => {
        setPrevMapString(mapString);
        setMapString(value);
    }

    return {
        mapString,
        setMapString: changeMapString,
        mappingResult,
    };
}