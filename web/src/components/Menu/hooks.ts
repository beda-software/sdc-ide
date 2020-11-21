import { useState } from 'react';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import _ from 'lodash';
import { arrowDown, arrowUp } from 'src/components/Icon';

export function useMenu() {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'block' } : { display: 'none' };

    const [questionnaireIdList] = useService<string[]>(async () => {
        const response = await getFHIRResources('Questionnaire', { _sort: 'id' });
        return mapSuccess(response, (data) => {
            return _.map(data.entry, (item) => item.resource.id);
        });
    });

    const symbol = showMenu ? arrowUp('white') : arrowDown('white');

    return { questionnaireIdList, toggleMenu, getMenuStyle, symbol };
}
