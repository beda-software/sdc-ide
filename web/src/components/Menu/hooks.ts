import { useCallback, useEffect, useState } from 'react';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResources, getMainResources } from 'aidbox-react/lib/services/fhir';
import { ArrowDirections } from 'src/components/Icon/Arrow';
import { getData, setData } from 'src/services/localStorage';
import { Questionnaire } from 'shared/src/contrib/aidbox';
import { applyDataTransformer } from 'aidbox-react/lib/services/service';

function useConfigForm() {
    const [baseUrl, setBaseUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const applyConfig = useCallback(() => {
        setData('connection', {
            client: username,
            secret: password,
            baseUrl,
        });
        window.location.reload();
    }, [baseUrl, username, password]);

    useEffect(() => {
        const { client, secret, baseUrl } = getData('connection');
        setUsername(client);
        setPassword(secret);
        setBaseUrl(baseUrl);
    }, []);

    return {
        baseUrl,
        setBaseUrl,
        username,
        setUsername,
        password,
        setPassword,
        applyConfig,
    };
}

export function useMenu() {
    const configForm = useConfigForm();
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'flex' } : { display: 'none' };

    const [questionnairesRD] = useService(async () =>
        applyDataTransformer(
            getFHIRResources<Questionnaire>('Questionnaire', { _sort: 'id' }),
            (bundle) => getMainResources<Questionnaire>(bundle, 'Questionnaire'),
        ),
    );

    const direction: ArrowDirections = showMenu ? 'up' : 'down';

    return { questionnairesRD, toggleMenu, getMenuStyle, direction, configForm };
}
