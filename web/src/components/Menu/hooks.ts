import { useCallback, useEffect, useState } from 'react';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { ArrowDirections } from 'src/components/Icon/Arrow';
import { getData, setData } from 'src/services/localStorage';

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
    const [showIdModal, setShowIdModal] = useState<boolean>(false);
    const [newQuestionnaireId, setNewQuestionnaireId] = useState('');

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'grid' } : { display: 'none' };

    const [questionnairesRD] = useService(() => getFHIRResources('Questionnaire', { _sort: 'id' }));

    const direction: ArrowDirections = showMenu ? 'up' : 'down';

    const openIdModal = () => {
        setShowIdModal(true);
    };

    const closeIdModal = () => {
        setShowIdModal(false);
    };

    const getIdModalStyle = showIdModal ? { display: 'flex' } : { display: 'none' };

    return {
        questionnairesRD,
        toggleMenu,
        getMenuStyle,
        direction,
        configForm,
        showIdModal,
        openIdModal,
        closeIdModal,
        getIdModalStyle,
        newQuestionnaireId,
        setNewQuestionnaireId,
    };
}
