import { ReactNode, useEffect, useState } from 'react';

import s from './ExternalRendererConsent.module.scss';

const CONSENT_KEY_PREFIX = 'external-renderer-consent-';

interface Props {
    engineId: string;
    engineName: string;
    publisher: string;
    description?: string;
    children: ReactNode;
}

export function ExternalRendererConsent({
    engineId,
    engineName,
    publisher,
    description,
    children,
}: Props) {
    const storageKey = `${CONSENT_KEY_PREFIX}${engineId}`;
    const [hasConsent, setHasConsent] = useState(false);
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [remember, setRemember] = useState(false);

    useEffect(() => {
        setHasConsent(localStorage.getItem(storageKey) === 'true');
    }, [storageKey]);

    const grant = () => {
        if (!checkboxChecked) return;
        if (remember) {
            localStorage.setItem(storageKey, 'true');
        }
        setHasConsent(true);
    };

    const revoke = () => {
        localStorage.removeItem(storageKey);
        setHasConsent(false);
        setCheckboxChecked(false);
        setRemember(false);
    };

    if (!hasConsent) {
        return (
            <div className={s.consentContainer}>
                <div className={s.header}>
                    <div className={s.engineName}>{engineName}</div>
                    <div className={s.publisher}>by {publisher}</div>
                </div>

                <div className={s.warning}>
                    <span className={s.warningIcon}>⚠</span>
                    <div>
                        <p>
                            Enabling this external renderer will send the questionnaire and
                            QuestionnaireResponse to <strong>{publisher}</strong>.
                        </p>
                        {description && <p>{description}</p>}
                        <p style={{ marginBottom: 0 }}>
                            Do not enter real patient data while using external renderers.
                        </p>
                    </div>
                </div>

                <label className={s.checkboxRow}>
                    <input
                        type="checkbox"
                        checked={checkboxChecked}
                        onChange={(e) => setCheckboxChecked(e.target.checked)}
                    />
                    <span>
                        I understand — allow sending data to {publisher} for questionnaire rendering
                    </span>
                </label>

                <label className={s.checkboxRow}>
                    <input
                        type="checkbox"
                        checked={remember}
                        disabled={!checkboxChecked}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span style={{ color: checkboxChecked ? undefined : '#aaa' }}>
                        Remember this choice
                    </span>
                </label>

                <button className={s.enableButton} disabled={!checkboxChecked} onClick={grant}>
                    Enable {engineName}
                </button>
            </div>
        );
    }

    return (
        <div className={s.contentWrapper}>
            <div className={s.engineSlot}>{children}</div>
            <div className={s.footer}>
                <span className={s.externalLabel}>(external renderer)</span>
                <button className={s.disableButton} onClick={revoke}>
                    ✕ Disable {engineName}
                </button>
            </div>
        </div>
    );
}
