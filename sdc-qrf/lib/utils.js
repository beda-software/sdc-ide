"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFhirQueryExpression = exports.calcInitialContext = exports.getEnabledQuestions = exports.removeDisabledAnswers = exports.getChecker = exports.isValueEqual = exports.findAnswersForQuestion = exports.findAnswersForQuestionsRecursive = exports.mapResponseToForm = exports.mapFormToResponse = exports.compareValue = exports.calcContext = exports.getBranchItems = exports.wrapAnswerValue = void 0;
var tslib_1 = require("tslib");
var fhirpath_1 = tslib_1.__importDefault(require("fhirpath"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
var isPlainObject_1 = tslib_1.__importDefault(require("lodash/isPlainObject"));
var query_string_1 = tslib_1.__importDefault(require("query-string"));
function wrapAnswerValue(type, answer) {
    var _a;
    if (type === 'choice') {
        if ((0, isPlainObject_1.default)(answer)) {
            return { Coding: answer };
        }
        else {
            return { string: answer };
        }
    }
    if (type === 'open-choice') {
        if ((0, isPlainObject_1.default)(answer)) {
            return { Coding: answer };
        }
        else {
            return { string: answer };
        }
    }
    if (type === 'text') {
        return { string: answer };
    }
    if (type === 'attachment') {
        return { Attachment: answer };
    }
    if (type === 'reference') {
        return { Reference: answer };
    }
    if (type === 'quantity') {
        return { Quantity: answer };
    }
    return _a = {}, _a[type] = answer, _a;
}
exports.wrapAnswerValue = wrapAnswerValue;
function getBranchItems(fieldPath, questionnaire, questionnaireResponse) {
    var _a, _b;
    var qrItem = questionnaireResponse;
    var qItem = questionnaire;
    var _loop_1 = function (i) {
        qItem = qItem.item.find(function (curItem) { return curItem.linkId === fieldPath[i]; });
        if (qrItem) {
            var qrItems = (_b = (_a = qrItem.item) === null || _a === void 0 ? void 0 : _a.filter(function (curItem) { return curItem.linkId === fieldPath[i]; })) !== null && _b !== void 0 ? _b : [];
            if (qItem.repeats) {
                if (i + 2 < fieldPath.length) {
                    // In the middle
                    qrItem = qrItems[parseInt(fieldPath[i + 2], 10)];
                }
                else {
                    return { value: { qItem: qItem, qrItems: qrItems } };
                }
            }
            else {
                qrItem = qrItems[0];
            }
        }
        if (qItem.repeats || qItem.type !== 'group') {
            i += 2;
        }
        else {
            i++;
        }
        out_i_1 = i;
    };
    var out_i_1;
    // TODO: check for question with sub items
    // TODO: check for root
    for (var i = 0; i < fieldPath.length; i++) {
        var state_1 = _loop_1(i);
        i = out_i_1;
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return { qItem: qItem, qrItems: [qrItem] };
}
exports.getBranchItems = getBranchItems;
function calcContext(initialContext, variables, qItem, qrItem) {
    // TODO: add root variable support
    return tslib_1.__assign({}, (variables || []).reduce(function (acc, curVariable) {
        var _a;
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[curVariable.name] = fhirpath_1.default.evaluate(qrItem || {}, curVariable.expression, acc), _a)));
    }, tslib_1.__assign(tslib_1.__assign({}, initialContext), { context: qrItem, qitem: qItem })));
}
exports.calcContext = calcContext;
function compareValue(firstAnswerValue, secondAnswerValue) {
    var firstValueType = lodash_1.default.keys(firstAnswerValue)[0];
    var secondValueType = lodash_1.default.keys(secondAnswerValue)[0];
    if (firstValueType !== secondValueType) {
        throw new Error('Enable when must be used for the same type');
    }
    if (!lodash_1.default.includes(['string', 'date', 'dateTime', 'time', 'uri', 'boolean', 'integer', 'decimal'], firstValueType)) {
        throw new Error('Impossible to compare non-primitive type');
    }
    if (firstValueType === 'Quantity') {
        throw new Error('Quantity type is not supported yet');
    }
    var firstValue = firstAnswerValue[firstValueType];
    var secondValue = secondAnswerValue[secondValueType];
    if (firstValue < secondValue) {
        return -1;
    }
    if (firstValue > secondValue) {
        return 1;
    }
    return 0;
}
exports.compareValue = compareValue;
function isGroup(question) {
    return question.type === 'group';
}
function isFormGroupItems(question, answers) {
    return isGroup(question) && lodash_1.default.isPlainObject(answers);
}
function isRepeatableFormGroupItems(question, answers) {
    return !!question.repeats && lodash_1.default.isArray(answers.items);
}
function hasSubAnswerItems(items) {
    return !!items && lodash_1.default.some(items, function (x) { return !lodash_1.default.some(x, lodash_1.default.isEmpty); });
}
function mapFormToResponseRecursive(answersItems, questionnaireItems) {
    return Object.entries(answersItems).reduce(function (acc, _a) {
        var linkId = _a[0], answers = _a[1];
        if (!linkId) {
            console.warn('The answer item has no linkId');
            return acc;
        }
        var question = questionnaireItems.filter(function (qItem) { return qItem.linkId === linkId; })[0];
        if (!question) {
            return acc;
        }
        if (isFormGroupItems(question, answers)) {
            var groups = isRepeatableFormGroupItems(question, answers)
                ? answers.items || []
                : answers.items
                    ? [answers.items]
                    : [];
            return groups.reduce(function (newAcc, group) {
                var _a;
                var items = mapFormToResponseRecursive(group, (_a = question.item) !== null && _a !== void 0 ? _a : []);
                return tslib_1.__spreadArray(tslib_1.__spreadArray([], newAcc, true), [
                    tslib_1.__assign({ linkId: linkId }, (items.length ? { item: items } : {})),
                ], false);
            }, acc);
        }
        return tslib_1.__spreadArray(tslib_1.__spreadArray([], acc, true), [
            {
                linkId: linkId,
                answer: answers.reduce(function (answersAcc, answer) {
                    var _a;
                    if (typeof answer === 'undefined') {
                        return answersAcc;
                    }
                    if (!answer.value) {
                        return answersAcc;
                    }
                    var items = hasSubAnswerItems(answer.items)
                        ? mapFormToResponseRecursive(answer.items, (_a = question.item) !== null && _a !== void 0 ? _a : [])
                        : [];
                    return tslib_1.__spreadArray(tslib_1.__spreadArray([], answersAcc, true), [
                        tslib_1.__assign({ value: answer.value }, (items.length ? { item: items } : {})),
                    ], false);
                }, []),
            },
        ], false);
    }, []);
}
function mapFormToResponse(values, questionnaire, keepDisabledAnswers) {
    var _a, _b;
    return {
        item: mapFormToResponseRecursive(keepDisabledAnswers ? values : removeDisabledAnswers((_a = questionnaire.item) !== null && _a !== void 0 ? _a : [], values), (_b = questionnaire.item) !== null && _b !== void 0 ? _b : []),
    };
}
exports.mapFormToResponse = mapFormToResponse;
function mapResponseToFormRecursive(questionnaireResponseItems, questionnaireItems) {
    return questionnaireItems.reduce(function (acc, question) {
        var _a, _b, _c;
        var _d, _e, _f, _g, _h, _j;
        var linkId = question.linkId, initial = question.initial, repeats = question.repeats, text = question.text;
        if (!linkId) {
            console.warn('The question has no linkId');
            return acc;
        }
        var qrItems = (_d = questionnaireResponseItems.filter(function (qrItem) { return qrItem.linkId === linkId; })) !== null && _d !== void 0 ? _d : [];
        if (qrItems.length && isGroup(question)) {
            if (repeats) {
                return tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[linkId] = {
                    question: text,
                    items: qrItems.map(function (qrItem) {
                        var _a, _b;
                        return mapResponseToFormRecursive((_a = qrItem.item) !== null && _a !== void 0 ? _a : [], (_b = question.item) !== null && _b !== void 0 ? _b : []);
                    }),
                }, _a));
            }
            else {
                return tslib_1.__assign(tslib_1.__assign({}, acc), (_b = {}, _b[linkId] = {
                    question: text,
                    items: mapResponseToFormRecursive((_f = (_e = qrItems[0]) === null || _e === void 0 ? void 0 : _e.item) !== null && _f !== void 0 ? _f : [], (_g = question.item) !== null && _g !== void 0 ? _g : []),
                }, _b));
            }
        }
        var answers = ((_j = (_h = qrItems === null || qrItems === void 0 ? void 0 : qrItems[0]) === null || _h === void 0 ? void 0 : _h.answer) === null || _j === void 0 ? void 0 : _j.length)
            ? qrItems[0].answer
            : initialToQuestionnaireResponseItemAnswer(initial);
        if (!answers.length) {
            return acc;
        }
        return tslib_1.__assign(tslib_1.__assign({}, acc), (_c = {}, _c[linkId] = answers.map(function (answer) {
            var _a, _b;
            return ({
                question: text,
                value: answer.value,
                items: mapResponseToFormRecursive((_a = answer.item) !== null && _a !== void 0 ? _a : [], (_b = question.item) !== null && _b !== void 0 ? _b : []),
            });
        }), _c));
    }, {});
}
function mapResponseToForm(resource, questionnaire) {
    var _a, _b;
    return mapResponseToFormRecursive((_a = resource.item) !== null && _a !== void 0 ? _a : [], (_b = questionnaire.item) !== null && _b !== void 0 ? _b : []);
}
exports.mapResponseToForm = mapResponseToForm;
function initialToQuestionnaireResponseItemAnswer(initial) {
    return (initial !== null && initial !== void 0 ? initial : []).map(function (_a) {
        var value = _a.value;
        return ({ value: value });
    });
}
function findAnswersForQuestionsRecursive(linkId, values) {
    if (values && lodash_1.default.has(values, linkId)) {
        return values[linkId];
    }
    return lodash_1.default.reduce(values, function (acc, v) {
        if (acc) {
            return acc;
        }
        if (lodash_1.default.isArray(v)) {
            return lodash_1.default.reduce(v, function (acc2, v2) {
                if (acc2) {
                    return acc2;
                }
                return findAnswersForQuestionsRecursive(linkId, v2.items);
            }, null);
        }
        else if (lodash_1.default.isArray(v.items)) {
            return lodash_1.default.reduce(v.items, function (acc2, v2) {
                if (acc2) {
                    return acc2;
                }
                return findAnswersForQuestionsRecursive(linkId, v2);
            }, null);
        }
        else {
            return findAnswersForQuestionsRecursive(linkId, v.items);
        }
    }, null);
}
exports.findAnswersForQuestionsRecursive = findAnswersForQuestionsRecursive;
function findAnswersForQuestion(linkId, parentPath, values) {
    var p = lodash_1.default.cloneDeep(parentPath);
    // Go up
    while (p.length) {
        var part = p.pop();
        // Find answers in parent groups (including repeatable)
        // They might have either 'items' of the group or number of the repeatable group in path
        if (part === 'items' || !isNaN(part)) {
            var parentGroup = lodash_1.default.get(values, tslib_1.__spreadArray(tslib_1.__spreadArray([], p, true), [part], false));
            if (typeof parentGroup === 'object' && linkId in parentGroup) {
                return parentGroup[linkId];
            }
        }
    }
    // Go down
    var answers = findAnswersForQuestionsRecursive(linkId, values);
    return answers ? answers : [];
}
exports.findAnswersForQuestion = findAnswersForQuestion;
function isValueEqual(firstValue, secondValue) {
    var _a, _b;
    var firstValueType = lodash_1.default.keys(firstValue)[0];
    var secondValueType = lodash_1.default.keys(secondValue)[0];
    if (firstValueType !== secondValueType) {
        console.error('Enable when must be used for the same type');
        return false;
    }
    if (firstValueType === 'Coding') {
        // NOTE: what if undefined === undefined
        return ((_a = firstValue.Coding) === null || _a === void 0 ? void 0 : _a.code) === ((_b = secondValue.Coding) === null || _b === void 0 ? void 0 : _b.code);
    }
    return lodash_1.default.isEqual(firstValue, secondValue);
}
exports.isValueEqual = isValueEqual;
function getChecker(operator) {
    if (operator === '=') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(values, function (_a) {
                var value = _a.value;
                return isValueEqual(value, answerValue);
            }) !== -1;
        };
    }
    if (operator === '!=') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(values, function (_a) {
                var value = _a.value;
                return isValueEqual(value, answerValue);
            }) === -1;
        };
    }
    if (operator === 'exists') {
        return function (values, answerValue) {
            var _a;
            var answersLength = lodash_1.default.reject(values, function (value) { return lodash_1.default.isEmpty(value.value) || lodash_1.default.every(lodash_1.default.mapValues(value.value, lodash_1.default.isEmpty)); }).length;
            var answer = (_a = answerValue === null || answerValue === void 0 ? void 0 : answerValue.boolean) !== null && _a !== void 0 ? _a : true;
            return answersLength > 0 === answer;
        };
    }
    if (operator === '>=') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(lodash_1.default.reject(values, function (value) { return lodash_1.default.isEmpty(value.value); }), function (_a) {
                var value = _a.value;
                return compareValue(value, answerValue) >= 0;
            }) !== -1;
        };
    }
    if (operator === '>') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(lodash_1.default.reject(values, function (value) { return lodash_1.default.isEmpty(value.value); }), function (_a) {
                var value = _a.value;
                return compareValue(value, answerValue) > 0;
            }) !== -1;
        };
    }
    if (operator === '<=') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(lodash_1.default.reject(values, function (value) { return lodash_1.default.isEmpty(value.value); }), function (_a) {
                var value = _a.value;
                return compareValue(value, answerValue) <= 0;
            }) !== -1;
        };
    }
    if (operator === '<') {
        return function (values, answerValue) {
            return lodash_1.default.findIndex(lodash_1.default.reject(values, function (value) { return lodash_1.default.isEmpty(value.value); }), function (_a) {
                var value = _a.value;
                return compareValue(value, answerValue) < 0;
            }) !== -1;
        };
    }
    console.error("Unsupported enableWhen.operator ".concat(operator));
    return lodash_1.default.constant(true);
}
exports.getChecker = getChecker;
function isQuestionEnabled(qItem, parentPath, values) {
    var enableWhen = qItem.enableWhen, enableBehavior = qItem.enableBehavior;
    if (!enableWhen) {
        return true;
    }
    var iterFn = enableBehavior === 'any' ? lodash_1.default.some : lodash_1.default.every;
    return iterFn(enableWhen, function (_a) {
        var question = _a.question, answer = _a.answer, operator = _a.operator;
        var check = getChecker(operator);
        if (lodash_1.default.includes(parentPath, question)) {
            // TODO: handle double-nested values
            var parentAnswerPath = lodash_1.default.slice(parentPath, 0, parentPath.length - 1);
            var parentAnswer = lodash_1.default.get(values, parentAnswerPath);
            return check(parentAnswer ? [parentAnswer] : [], answer);
        }
        var answers = findAnswersForQuestion(question, parentPath, values);
        return check(lodash_1.default.compact(answers), answer);
    });
}
function removeDisabledAnswers(questionnaireItems, values) {
    return removeDisabledAnswersRecursive(questionnaireItems, [], values, {});
}
exports.removeDisabledAnswers = removeDisabledAnswers;
function removeDisabledAnswersRecursive(questionnaireItems, parentPath, answersItems, initialValues) {
    return questionnaireItems.reduce(function (acc, questionnaireItem) {
        var _a, _b, _c;
        var _d;
        var values = parentPath.length ? lodash_1.default.set(lodash_1.default.cloneDeep(initialValues), parentPath, acc) : acc;
        var linkId = questionnaireItem.linkId;
        var answers = answersItems[linkId];
        if (!answers) {
            return acc;
        }
        if (!isQuestionEnabled(questionnaireItem, parentPath, values)) {
            return acc;
        }
        if (isFormGroupItems(questionnaireItem, answers)) {
            if (!answers.items) {
                return acc;
            }
            if (isRepeatableFormGroupItems(questionnaireItem, answers)) {
                return tslib_1.__assign(tslib_1.__assign({}, acc), (_a = {}, _a[linkId] = tslib_1.__assign(tslib_1.__assign({}, answers), { items: answers.items.map(function (group, index) {
                        var _a;
                        return removeDisabledAnswersRecursive((_a = questionnaireItem.item) !== null && _a !== void 0 ? _a : [], tslib_1.__spreadArray(tslib_1.__spreadArray([], parentPath, true), [linkId, 'items', index.toString()], false), group, values);
                    }) }), _a));
            }
            else {
                return tslib_1.__assign(tslib_1.__assign({}, acc), (_b = {}, _b[linkId] = tslib_1.__assign(tslib_1.__assign({}, answers), { items: removeDisabledAnswersRecursive((_d = questionnaireItem.item) !== null && _d !== void 0 ? _d : [], tslib_1.__spreadArray(tslib_1.__spreadArray([], parentPath, true), [linkId, 'items'], false), answers.items, values) }), _b));
            }
        }
        return tslib_1.__assign(tslib_1.__assign({}, acc), (_c = {}, _c[linkId] = answers.reduce(function (answersAcc, answer, index) {
            var _a;
            if (typeof answer === 'undefined') {
                return answersAcc;
            }
            if (!answer.value) {
                return answersAcc;
            }
            var items = hasSubAnswerItems(answer.items)
                ? removeDisabledAnswersRecursive((_a = questionnaireItem.item) !== null && _a !== void 0 ? _a : [], tslib_1.__spreadArray(tslib_1.__spreadArray([], parentPath, true), [linkId, index.toString(), 'items'], false), answer.items, values)
                : {};
            return tslib_1.__spreadArray(tslib_1.__spreadArray([], answersAcc, true), [tslib_1.__assign(tslib_1.__assign({}, answer), { items: items })], false);
        }, []), _c));
    }, {});
}
function getEnabledQuestions(questionnaireItems, parentPath, values) {
    return lodash_1.default.filter(questionnaireItems, function (qItem) {
        var linkId = qItem.linkId;
        if (!linkId) {
            return false;
        }
        return isQuestionEnabled(qItem, parentPath, values);
    });
}
exports.getEnabledQuestions = getEnabledQuestions;
function calcInitialContext(qrfDataContext, values) {
    var questionnaireResponse = tslib_1.__assign(tslib_1.__assign({}, qrfDataContext.questionnaireResponse), mapFormToResponse(values, qrfDataContext.questionnaire));
    return tslib_1.__assign(tslib_1.__assign({}, qrfDataContext.launchContextParameters.reduce(function (acc, _a) {
        var _b;
        var name = _a.name, value = _a.value, resource = _a.resource;
        return (tslib_1.__assign(tslib_1.__assign({}, acc), (_b = {}, _b[name] = value && (0, isPlainObject_1.default)(value)
            ? value[Object.keys(value)[0]]
            : resource, _b)));
    }, {})), { 
        // Vars defined in IG
        questionnaire: qrfDataContext.questionnaire, resource: questionnaireResponse, context: questionnaireResponse, 
        // Vars we use for backward compatibility
        Questionnaire: qrfDataContext.questionnaire, QuestionnaireResponse: questionnaireResponse });
}
exports.calcInitialContext = calcInitialContext;
function resolveTemplateExpr(str, context) {
    var matches = str.match(/{{[^}]+}}/g);
    if (matches) {
        return matches.reduce(function (result, match) {
            var expr = match.replace(/[{}]/g, '');
            var resolvedVar = fhirpath_1.default.evaluate(context.context || {}, expr, context);
            if (resolvedVar === null || resolvedVar === void 0 ? void 0 : resolvedVar.length) {
                return result.replace(match, resolvedVar.join(','));
            }
            else {
                return result.replace(match, '');
            }
        }, str);
    }
    return str;
}
function parseFhirQueryExpression(expression, context) {
    var _a = expression.split('?', 2), resourceType = _a[0], paramsQS = _a[1];
    var searchParams = Object.fromEntries(Object.entries(query_string_1.default.parse(paramsQS !== null && paramsQS !== void 0 ? paramsQS : '')).map(function (_a) {
        var key = _a[0], value = _a[1];
        if (!value) {
            return [key, value];
        }
        return [
            key,
            (0, isArray_1.default)(value)
                ? value.map(function (arrValue) { return resolveTemplateExpr(arrValue, context); })
                : resolveTemplateExpr(value, context),
        ];
    }));
    return [resourceType, searchParams];
}
exports.parseFhirQueryExpression = parseFhirQueryExpression;
//# sourceMappingURL=utils.js.map