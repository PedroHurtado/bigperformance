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
        return function () { return text };
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
    return function (data) {

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

    }
}

function hasExpression(text) {
    return text && text.indexOf('{') > -1;
}

function* childNodes(parent, filter) {
    for (let child = parent.firstChild; child;
        child = child.nextSibling) {
        if (filter(child)) {
            if (child.childNodes.length > 0) {
                yield child;
                yield* childNodes(child, filter)
            } else {
                yield child;
            }
        }
    }
}

function getPropertyDescriptor(obj, property) {
    return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), property);
}
function isRepeat(node) {
    return node.localName === 'template' && node.getAttribute('is') === 'pld-repeat';
}
function isIf(node) {
    return node.localName === 'template' && node.getAttribute('is') === 'pld-if';
}
function isTemplate(node){
    return isRepeat(node) || isIf(node);
}
function bindAttributes(node, data) {
    for (let i = 0; i < node.attributes.length; i++) {
        let value = node.attributes[i].value;
        let name = node.attributes[i].name;
        let obj = interpolate(value)(data);
        if (getPropertyDescriptor(node, name)) {
            if (obj !== node[name]) {
                node[name] = obj;
            }
        }
        else {
            if (node.attributes[i].value !== obj) {
                node.attributes[i].value = obj;
            }
        }
    }
}

export function bind(template, data) {
    let clone = template.content.cloneNode(true);
    let doc = new Document;
    let body = doc.createElement('body');
    body.appendChild(clone);
    doc.appendChild(body);
    let img = doc.querySelector('img');
    window.alert(img.src);
    let templates = [];
    let predicate = (node) => node.localName !== 'style' && node.localName !== 'script';
    for (let node of childNodes(body, predicate)) {
        if (node.nodeType === 3) { //text
            let text = interpolate(node.textContent)(data);
            if (text !== node.textContent) {
                node.textContent = text;
            }
        } else {
            bindAttributes(node, data);
            if (isTemplate(node)) {
                let templateChild = node.clone();
                let bindTemplate = bind(templateChild, data);
                node.parentNode.insertBefore(bindTemplate, node);
                templates.push(node);
            }
        }
    }
    templates.forEach(tpl => tpl.remove());
    return body;
}

