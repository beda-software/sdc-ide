import { EditorView } from '@codemirror/view';
import { toast } from 'react-toastify';
import YAML, { Pair, visitor, visitorFn } from 'yaml';

import { ExpressionType, CursorPosition } from './types';

interface QuestionnaireVisitor {
    Pair?: visitorFn<Pair<any, any>>;
}

// no more strict type
type Path = readonly any[];

interface Props {
    view: EditorView;
    position: CursorPosition;
    openDebugger: (expression: string, type: ExpressionType) => void;
}

export function getExpression(props: Props) {
    const { view, position, openDebugger } = props;
    let type: ExpressionType | undefined;
    let expression = '';

    const doc = YAML.parseDocument(view.state.doc.toString());
    const index = view.posAtCoords({ x: position.left, y: position.top });

    const questionnaireVisitor: QuestionnaireVisitor = {
        Pair(_, pair, path: Path) {
            if (index !== null && index >= pair.value.range[0] && index <= pair.value.range[2]) {
                const length = path.length;
                if (
                    pair.key.value === 'expression' &&
                    path[length - 1].items[0].key.value === 'language' &&
                    path[length - 1].items[0].value.value === 'text/fhirpath'
                ) {
                    type = 'LaunchContext';
                    expression = pair.value.value;
                    return YAML.visit.BREAK;
                }
                if (
                    pair.key.value === 'localRef' &&
                    path[length - 3].key.value === 'sourceQueries'
                ) {
                    type = 'SourceQueries';
                    expression = pair.value.value.split('#')[1];
                    return YAML.visit.BREAK;
                }
                if (
                    pair.key.value === 'reference' &&
                    pair.value.value.slice(0, 7) === '#Bundle' &&
                    path[length - 2].key.value === 'valueReference' &&
                    path[length - 3].items[0].key.value === 'url'
                ) {
                    type = 'SourceQueries';
                    expression = pair.value.value.split('#')[2];
                    return YAML.visit.BREAK;
                }
            }
        },
    };

    YAML.visit(doc, questionnaireVisitor as visitor);

    if (type && expression) {
        openDebugger(expression, type);
    } else {
        toast.warning('Debugger is available only for FHIRPath expressions');
    }
}
