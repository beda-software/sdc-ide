import { useCallback, useEffect, useState } from 'react';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { ArrowDirections } from 'src/components/Icon/Arrow';

function useConfigForm() {
    const [baseUrl, setBaseUrl] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const applyConfig = useCallback(() => {
        window.localStorage.username = username;
        window.localStorage.password = password;
        window.localStorage.baseUrl = baseUrl;
        window.location.reload();
    }, [baseUrl, username, password]);

    useEffect(() => {
        const { username, password, baseUrl } = window.localStorage;
        setUsername(username);
        setPassword(password);
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

    const getMenuStyle = showMenu ? { display: 'grid' } : { display: 'none' };

    const [questionnairesRD] = useService(() => getFHIRResources('Questionnaire', { _sort: 'id' }));

    const direction: ArrowDirections = showMenu ? 'up' : 'down';

    return { questionnairesRD, toggleMenu, getMenuStyle, direction, configForm };
}
