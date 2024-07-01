import { Parameters, Questionnaire, QuestionnaireResponse } from "fhir/r4b";
import { service } from "./fhir";

export async function populate(launchContext:Parameters) {
    const response = await service<QuestionnaireResponse>({
        method: 'POST',
        url: '/Questionnaire/$populate',
        data: launchContext,
    });
    return response;
}

export async function assemble(questionnaireId:string){
    const response = await service<Questionnaire>({
        method: 'GET',
        url: `Questionnaire/${questionnaireId}/$assemble`,
    });

    return response;
}
