import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowDirections } from 'web/src/components/Icon/Arrow';

import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';

export function useMenu() {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const history = useHistory();
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'flex' } : { display: 'none' };

    const [questionnairesRD] = useService(async () =>
        mapSuccess(
            await getFHIRResources<Questionnaire>('Questionnaire', { _sort: 'id' }),
            (bundle) => extractBundleResources(bundle).Questionnaire,
        ),
    );

    const direction: ArrowDirections = showMenu ? 'up' : 'down';

    return { questionnairesRD, toggleMenu, getMenuStyle, direction, history };
}
