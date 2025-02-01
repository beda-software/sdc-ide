import { useState } from 'react';
import { Button } from 'web/src/components/Button';
import { InputField } from 'web/src/components/InputField';

import s from './ModalCreateLaunchContext.module.scss';
import { LaunchContext } from '../LaunchContextEditor/types';

interface ModalCreateLaunchContextProps {
    saveLaunchContext: (partialLaunchContext: LaunchContext) => Promise<any>;
    closeModal: () => void;
}

export function ModalCreateLaunchContext({
    saveLaunchContext,
    closeModal,
}: ModalCreateLaunchContextProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState('');

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new launch context?</div>
                <InputField
                    input={{
                        value: name,
                        onChange: (e) => setName(e.target.value),
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    required
                    label="Name"
                />
                <InputField
                    input={{
                        value: type,
                        onChange: (e) => setType(e.target.value),
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    required
                    label="Type"
                />
                <Button
                    onClick={() => {
                        if (!name || !type) {
                            return;
                        }

                        saveLaunchContext({
                            name,
                            types: [type],
                        });
                        closeModal();
                    }}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
