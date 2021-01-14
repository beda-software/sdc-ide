import { useState } from 'react';
import { useService } from 'aidbox-react/src/hooks/service';
import { getFHIRResources } from 'aidbox-react/src/services/fhir';
import { mapSuccess } from 'aidbox-react/src/services/service';
import _ from 'lodash';
import { ArrowDirections } from 'src/components/Icon/Arrow';

export function useMenu() {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'block' } : { display: 'none' };

    const [questionnaireIdList] = useService<string[]>(async () => {
        const response = await getFHIRResources('Questionnaire', { _sort: 'id' });
        return mapSuccess(response, (data) => {
            return _.map(data.entry, (item) => item.resource!.id!);
        });
    });

    const direction: ArrowDirections = showMenu ? 'up' : 'down';

    return { questionnaireIdList, toggleMenu, getMenuStyle, direction };
}
