export const expectedPreparedSourceQueryData = {
    id: 'DietAndNutrition',
    type: 'batch',
    entry: [
        {
            request: {
                url: '/NutritionOrder?patient=patient-1&status=active',
                method: 'GET',
            },
        },
    ],
    resourceType: 'Bundle',
};
