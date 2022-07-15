"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireResponseFormProvider = exports.QuestionItem = exports.QuestionItems = exports.usePreviousValue = void 0;
var tslib_1 = require("tslib");
var jsx_runtime_1 = require("react/jsx-runtime");
var classnames_1 = tslib_1.__importDefault(require("classnames"));
var fhirpath_1 = tslib_1.__importDefault(require("fhirpath"));
var lodash_1 = tslib_1.__importDefault(require("lodash"));
var isEqual_1 = tslib_1.__importDefault(require("lodash/isEqual"));
var react_1 = require("react");
var _1 = require(".");
var context_1 = require("./context");
var utils_1 = require("./utils");
function usePreviousValue(value) {
    var prevValue = (0, react_1.useRef)();
    (0, react_1.useEffect)(function () {
        prevValue.current = value;
        return function () {
            prevValue.current = undefined;
        };
    });
    return prevValue.current;
}
exports.usePreviousValue = usePreviousValue;
function QuestionItems(props) {
    var questionItems = props.questionItems, parentPath = props.parentPath, context = props.context;
    var formValues = (0, _1.useQuestionnaireResponseFormContext)().formValues;
    var cleanValues = (0, utils_1.removeDisabledAnswers)(context.questionnaire.item, formValues);
    return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, utils_1.getEnabledQuestions)(questionItems, parentPath, cleanValues).map(function (item, index) {
            return ((0, jsx_runtime_1.jsx)("div", tslib_1.__assign({ className: (0, classnames_1.default)('questionFormItem', item.linkId) }, { children: (0, jsx_runtime_1.jsx)(QuestionItem, { questionItem: item, context: context, parentPath: parentPath }, index) })));
        }) }));
}
exports.QuestionItems = QuestionItems;
function QuestionItem(props) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    var questionItem = props.questionItem, initialContext = props.context, parentPath = props.parentPath;
    var _s = (0, react_1.useContext)(context_1.QRFContext), questionItemComponents = _s.questionItemComponents, customWidgets = _s.customWidgets, groupItemComponent = _s.groupItemComponent, itemControlQuestionItemComponents = _s.itemControlQuestionItemComponents, itemControlGroupItemComponents = _s.itemControlGroupItemComponents;
    var _t = (0, _1.useQuestionnaireResponseFormContext)(), formValues = _t.formValues, setFormValues = _t.setFormValues;
    var type = questionItem.type, linkId = questionItem.linkId, calculatedExpression = questionItem.calculatedExpression, variable = questionItem.variable, repeats = questionItem.repeats, itemControl = questionItem.itemControl;
    var fieldPath = (0, react_1.useMemo)(function () { return tslib_1.__spreadArray(tslib_1.__spreadArray([], parentPath, true), [linkId], false); }, [parentPath, linkId]);
    // TODO: how to do when item is not in QR (e.g. default element of repeatable group)
    var branchItems = (0, utils_1.getBranchItems)(fieldPath, initialContext.questionnaire, initialContext.resource);
    var context = type === 'group'
        ? branchItems.qrItems.map(function (curQRItem) {
            return (0, utils_1.calcContext)(initialContext, variable, branchItems.qItem, curQRItem);
        })
        : (0, utils_1.calcContext)(initialContext, variable, branchItems.qItem, branchItems.qrItems[0]);
    var prevAnswers = usePreviousValue(lodash_1.default.get(formValues, fieldPath));
    (0, react_1.useEffect)(function () {
        if (!isGroupItem(questionItem, context) && calculatedExpression) {
            // TODO: Add support for x-fhir-query
            if (calculatedExpression.language === 'text/fhirpath') {
                var newValues = fhirpath_1.default.evaluate(context.context || {}, calculatedExpression.expression, context);
                var newAnswers = newValues.length
                    ? repeats
                        ? newValues.map(function (answer) { return ({ value: (0, utils_1.wrapAnswerValue)(type, answer) }); })
                        : [{ value: (0, utils_1.wrapAnswerValue)(type, newValues[0]) }]
                    : undefined;
                if (!(0, isEqual_1.default)(newAnswers, prevAnswers)) {
                    setFormValues(lodash_1.default.set(lodash_1.default.cloneDeep(formValues), fieldPath, newAnswers));
                }
            }
        }
    }, [
        setFormValues,
        formValues,
        calculatedExpression,
        context,
        parentPath,
        repeats,
        type,
        questionItem,
        prevAnswers,
        fieldPath,
    ]);
    if (isGroupItem(questionItem, context)) {
        if (itemControl) {
            if (!itemControlGroupItemComponents ||
                !itemControlGroupItemComponents[(_b = (_a = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.code]) {
                console.warn("QRF: Unsupported group itemControl '".concat((_d = (_c = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.code, "'. \n                Please define 'itemControlGroupWidgets' for '").concat((_f = (_e = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.code, "'"));
                return null;
            }
            var Component = itemControlGroupItemComponents[(_h = (_g = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.code];
            return ((0, jsx_runtime_1.jsx)(Component, { context: context, parentPath: parentPath, questionItem: questionItem }));
        }
        if (!groupItemComponent) {
            console.warn("QRF: groupWidget is not specified but used in questionnaire.");
            return null;
        }
        var GroupWidgetComponent = groupItemComponent;
        return ((0, jsx_runtime_1.jsx)(GroupWidgetComponent, { context: context, parentPath: parentPath, questionItem: questionItem }));
    }
    if (itemControl) {
        if (!itemControlQuestionItemComponents ||
            !itemControlQuestionItemComponents[(_k = (_j = itemControl.coding) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.code]) {
            console.warn("QRF: Unsupported itemControl '".concat((_m = (_l = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.code, "'.\nPlease define 'itemControlWidgets' for '").concat((_p = (_o = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.code, "'"));
            return null;
        }
        var Component = itemControlQuestionItemComponents[(_r = (_q = itemControl === null || itemControl === void 0 ? void 0 : itemControl.coding) === null || _q === void 0 ? void 0 : _q[0]) === null || _r === void 0 ? void 0 : _r.code];
        return (0, jsx_runtime_1.jsx)(Component, { context: context, parentPath: parentPath, questionItem: questionItem });
    }
    // TODO: deprecate!
    if (customWidgets && linkId && linkId in customWidgets) {
        console.warn("QRF: 'customWidgets' are deprecated, use 'Questionnaire.item.itemControl' instead");
        if (type === 'group') {
            console.error("QRF: Use 'itemControl' for group custom widgets");
            return null;
        }
        var Component = customWidgets[linkId];
        return (0, jsx_runtime_1.jsx)(Component, { context: context, parentPath: parentPath, questionItem: questionItem });
    }
    if (type in questionItemComponents) {
        var Component = questionItemComponents[type];
        return (0, jsx_runtime_1.jsx)(Component, { context: context, parentPath: parentPath, questionItem: questionItem });
    }
    console.error("QRF: Unsupported item type '".concat(type, "'"));
    return null;
}
exports.QuestionItem = QuestionItem;
function QuestionnaireResponseFormProvider(_a) {
    var children = _a.children, props = tslib_1.__rest(_a, ["children"]);
    return (0, jsx_runtime_1.jsx)(context_1.QRFContext.Provider, tslib_1.__assign({ value: props }, { children: children }));
}
exports.QuestionnaireResponseFormProvider = QuestionnaireResponseFormProvider;
/* Helper that resolves right context type */
function isGroupItem(questionItem, context) {
    return questionItem.type === 'group';
}
//# sourceMappingURL=components.js.map