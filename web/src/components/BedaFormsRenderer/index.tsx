import { Questionnaire, QuestionnaireResponse, Parameters } from 'fhir/r4b';
import { useEffect, useRef, useState } from 'react';

import { questionnaireProfileUrl } from 'shared/src/constants';

const BEDA_FORMS_URL = 'https://beda-forms.emr.beda.software';
const BEDA_FORMS_TAG = 'beda:generated';

function normalizeProfile(q: Questionnaire): Questionnaire {
    return { ...q, meta: { ...q.meta, profile: [questionnaireProfileUrl] } };
}

interface Props {
    questionnaire: Questionnaire;
    questionnaireResponse: QuestionnaireResponse;
    launchContextParameters: Parameters['parameter'];
    onChange: (qr: QuestionnaireResponse) => void;
}

function generateId(): string {
    return 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

export function BedaFormsRenderer({ questionnaire, questionnaireResponse, onChange }: Props) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const pendingResponses = useRef(new Map<string, (response: any) => void>());
    const messagingHandle = useRef(
        'beda-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
    );
    const [isReady, setIsReady] = useState(false);
    // Track the latest QR that originated from beda-forms (to skip re-pushing it)
    const originatedFromBeda = useRef(false);

    const postToRenderer = (message: any) => {
        iframeRef.current?.contentWindow?.postMessage(message, BEDA_FORMS_URL);
    };

    const sendRequest = (messageType: string, payload: any, timeout = 5000): Promise<any> => {
        return new Promise((resolve, reject) => {
            const msgId = generateId();
            const timer = setTimeout(() => {
                pendingResponses.current.delete(msgId);
                reject(new Error(`[BedaForms] Timeout waiting for: ${messageType}`));
            }, timeout);
            pendingResponses.current.set(msgId, (response) => {
                clearTimeout(timer);
                resolve(response);
            });
            postToRenderer({
                messagingHandle: messagingHandle.current,
                messageId: msgId,
                messageType,
                payload,
            });
        });
    };

    const runInitSequence = async () => {
        try {
            await sendRequest('status.handshake', { protocolVersion: '1.0', fhirVersion: 'R4' });
            await sendRequest('sdc.configure', {});
            await sendRequest('sdc.configureContext', {});
            await sendRequest('sdc.displayQuestionnaire', {
                questionnaire: normalizeProfile(questionnaire),
            });
            setIsReady(true);
        } catch (e) {
            console.error('[BedaForms] Init sequence failed:', e);
        }
    };

    const handleMessage = (event: MessageEvent) => {
        if (event.origin !== BEDA_FORMS_URL) return;
        if (event.data?.source?.startsWith('react-devtools-')) return;

        const msg = event.data;

        if ('responseToMessageId' in msg) {
            const resolver = pendingResponses.current.get(msg.responseToMessageId);
            if (resolver) {
                pendingResponses.current.delete(msg.responseToMessageId);
                resolver(msg);
            }
            return;
        }

        if ('messageType' in msg && msg.messagingHandle === messagingHandle.current) {
            if (
                msg.messageType === 'sdc.ui.changedQuestionnaireResponse' &&
                msg.payload?.questionnaireResponse
            ) {
                const qr = msg.payload.questionnaireResponse as QuestionnaireResponse;
                const tagged: QuestionnaireResponse = JSON.parse(JSON.stringify(qr));
                if (!tagged.meta) tagged.meta = { tag: [] };
                if (!tagged.meta.tag) tagged.meta.tag = [];
                if (!tagged.meta.tag.find((t) => t.code === BEDA_FORMS_TAG)) {
                    tagged.meta.tag.push({ code: BEDA_FORMS_TAG });
                }
                originatedFromBeda.current = true;
                onChange(tagged);
            }
        }
    };

    useEffect(() => {
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const onIframeLoad = async () => {
        // Small delay for React inside the iframe to mount and register its message listener
        await new Promise<void>((r) => setTimeout(r, 200));
        setIsReady(false);
        await runInitSequence();
    };

    // Push questionnaire changes into the renderer after init
    useEffect(() => {
        if (!isReady) return;
        setIsReady(false);
        sendRequest('sdc.displayQuestionnaire', { questionnaire: normalizeProfile(questionnaire) })
            .then(() => setIsReady(true))
            .catch((e) => console.error('[BedaForms] displayQuestionnaire failed:', e));
    }, [questionnaire]);

    // Push incoming QR changes from other parts of the IDE, skipping those that came from beda itself
    useEffect(() => {
        if (!isReady) return;
        if (originatedFromBeda.current) {
            originatedFromBeda.current = false;
            return;
        }
        const qr: QuestionnaireResponse = JSON.parse(JSON.stringify(questionnaireResponse));
        delete qr.meta;
        qr.status = 'in-progress';
        sendRequest('sdc.displayQuestionnaireResponse', { questionnaireResponse: qr }).catch((e) =>
            console.error('[BedaForms] displayQuestionnaireResponse failed:', e),
        );
    }, [questionnaireResponse]);

    const iframeSrc = (() => {
        const params = new URLSearchParams({
            messaging_handle: messagingHandle.current,
            messaging_origin: window.location.origin,
            embedded_mode: 'true',
        });
        return `${BEDA_FORMS_URL}?${params}`;
    })();

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {!isReady && (
                <div
                    style={{
                        padding: '12px 16px',
                        fontSize: '13px',
                        color: '#666',
                        borderBottom: '1px solid #e0e0e0',
                    }}
                >
                    Connecting to Beda Forms…
                </div>
            )}
            <iframe
                ref={iframeRef}
                src={iframeSrc}
                onLoad={onIframeLoad}
                style={{ flex: 1, width: '100%', border: 'none', minHeight: 0 }}
                allow="*"
                title="Beda Forms Renderer"
            />
        </div>
    );
}
