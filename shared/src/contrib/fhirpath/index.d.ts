declare module 'fhirpath' {
    export function evaluate(fhirData: Resource, path: string, context: void | Record<string, any>, model?: any)
}