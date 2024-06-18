const envs = {
    baseURL: ['BASE_URL', 'http://localhost:8080'],
    juteURL: ['JUTE_URL', 'http://localhost:8099'],
    aiQuestionnaireBuilderUrl: ['AI_BUILDER_URL', 'http://localhost:3002'],
    fhirpathMappingUrl: ['FHIRPATHMAPPING_URL', 'http://localhost:8091'],
    fhirMappingLanguageUrl: ['FHIRMAPPING_URL','http://localhost:8084/matchboxv3/fhir']
}

export const configuration:Record<keyof typeof envs,string> = {} as any;

const globalConfig = (window as any)

Object.keys(envs).forEach((key) => {
    const [globalKey,defaultValue] = envs[key];
    if(globalConfig[globalKey] == `{{${globalKey}}}`){
        configuration[key] = defaultValue;
    } else {
        configuration[key] = globalConfig[globalKey];
    }
})
console.log(configuration)
