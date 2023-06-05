import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ArrowDirections } from 'web/src/components/Icon/Arrow';
import { getData } from 'web/src/services/localStorage';

import { useService } from 'aidbox-react/lib/hooks/service';
import { extractBundleResources, getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';

import { Questionnaire } from 'shared/src/contrib/aidbox';

function useConfigForm() {
    const [baseUrl, setBaseUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const { client, secret, baseUrl: configBaseUrl } = getData('connection');
        setUsername(client);
        setPassword(secret);
        setBaseUrl(configBaseUrl);
    }, []);

    return {
        baseUrl,
        setBaseUrl,
        username,
        setUsername,
        password,
        setPassword,
    };
}

export function useMenu() {
    const configForm = useConfigForm();
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const history = useHistory()
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

    return { questionnairesRD, toggleMenu, getMenuStyle, direction, configForm, history };
}
