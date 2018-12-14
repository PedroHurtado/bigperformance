function interpolate(text) {
    let startIndex,
        endIndex,
        index = 0,
        expressions = [],
        parseFns,
        textLength = text.length,
        exp,
        concat = [],
        singleExpression;

    if (!hasExpression(text)) {
        return Object.assign(function () { return text }, { expressions: undefined });
    }
    while (index < textLength) {
        if (((startIndex = text.indexOf('{', index)) !== -1) &&
            ((endIndex = text.indexOf('}', startIndex + 1)) !== -1)) {
            if (index !== startIndex) {
                concat.push(text.substring(index, startIndex));
            }
            exp = text.substring(startIndex + 1, endIndex);
            expressions.push(exp);
            index = endIndex + 1;
            concat.push('');
        } else {

            if (index !== textLength) {
                concat.push(text.substring(index));
            }
            break;
        }
    }
    return Object.assign(function (data) {

        function getData(expresion, obj) {
            let expresionArray = expresion.split('.');
            let value = obj[expresionArray[0]];
            for (let i = 1; i < expresionArray.length; i++) {
                value = value[expresionArray[i]];
                if (value === undefined) {
                    break;
                }
            }
            return value;
        }
        function createExpression(expression) {
            return `{${expression}}`
        }

        let textConcat = [];
        if (!data) {
            return text;
        }
        let indexData = 0;
        for (let i = 0; i < concat.length; i++) {
            let text = concat[i];
            if (!text) {
                let expression = expressions[indexData];
                let value = getData(expression, data);
                textConcat[i] = value !== undefined ? value : createExpression(expression);
                indexData++;
            }
        }
        if (textConcat.length === 1 && (Array.isArray(textConcat[0])
            || typeof textConcat[0] === 'object'
            || typeof textConcat[0] === 'boolean')) {
            return textConcat[0];
        }
        else {
            return textConcat.join('');
        }

    }, { expressions: expressions })
}

function hasExpression(text) {
    return text && text.indexOf('{') > -1;
}
function padLeft(id) {
    var str = "" + id
    var pad = "00"
    return pad.substring(0, pad.length - str.length) + str
}
function createId(parent, id) {
    return `${parent}.${padLeft(id)}`
}
function* childNodes(parent, filter, index) {
    let i = 1;
    for (let child = parent.firstChild; child;
        child = child.nextSibling) {
        if (filter(child)) {
            if (child.childNodes.length > 0) {
                let id = createId(index, i);
                yield { id, node: child };
                yield* childNodes(child, filter, id)
            } else {
                yield { id: createId(index, i), node: child };
            }
            i++;
        }
    }
}
function upgrade(obj) {
    if (obj.localName.includes('-') || obj.hasAttribute('is')) {
        let node = document.importNode(obj, true);
        window.customElements.upgrade(node);
        obj.replaceWith(node);
        return node;
    }
    return obj;
}
function getPropertyDescriptor(prototype, property) {
    return Object.getOwnPropertyDescriptor(prototype, property);
}
function isRepeat(node) {
    return node.localName === 'template' && node.getAttribute('is') === 'pld-repeat';
}
function isIf(node) {
    return node.localName === 'template' && node.getAttribute('is') === 'pld-if';
}
function isTemplate(node) {
    return isRepeat(node) || isIf(node);
}
function bindAttributes(binding, data) {
    let {id,node} =binding;
    let prototype = Object.getPrototypeOf(node);
    for (let i = 0; i < node.attributes.length; i++) {
        let { name, value } = node.attributes[i];
        let _interpolate = interpolate(value);
        if (_interpolate.expressions) {
            binding.expressions = _interpolate.expressions;
            let obj = _interpolate(data);
            if (getPropertyDescriptor(prototype, name)) {
                node[name] = obj;
            }
            else {
                node.attributes[i].value = obj;
            }
        }
    }
}

export function bind(template, data) {
    let clone = template.content.cloneNode(true);
    let templates = [];
    let predicate = (node) => node.localName !== 'style' && node.localName !== 'script';
    let nodes = Array.from(childNodes(clone, predicate, '01'));
    for (let binding of nodes) {
        let {id,node}=binding;
        if (node.nodeType === 3) { //text
            let text = node.textContent;
            let _interpolate = interpolate(text);
            if (_interpolate.expressions) {
                binding.expressions = _interpolate.expressions;
                node.textContent = _interpolate(data);
            }
        } else {
            node = upgrade(node);
            binding.node = node;
            bindAttributes(binding, data);
            if (isTemplate(node)) {
                let templateChild = node.clone();
                let bindTemplate = bind(templateChild, data);
                node.parentNode.insertBefore(bindTemplate, node);
                templates.push(node);
            }
        }
    }
    templates.forEach(tpl => tpl.remove());
    return clone;
}

