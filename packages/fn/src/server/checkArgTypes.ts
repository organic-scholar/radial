const ReactPropTypesSecret = require('prop-types/lib/ReactPropTypesSecret');

export function checkArgTypes(typeSpecs, values, location, componentName) {
    for (var typeSpecName in typeSpecs) {
        if (typeSpecs.hasOwnProperty(typeSpecName)) {
            var error;
            try {
                if (typeof typeSpecs[typeSpecName] !== 'function') {
                    var err = Error(
                        (componentName || 'class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                        'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
                    );
                    err.name = 'Invariant Violation';
                    throw err;
                }
                error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
            } catch (ex) {
                error = ex;
            }
            if (error && !(error instanceof Error)) {
                return (
                    (componentName || 'class') + ': type specification of ' +
                    location + ' `' + typeSpecName + '` is invalid; the type checker ' +
                    'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
                    'You may have forgotten to pass an argument to the type checker ' +
                    'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
                    'shape all require an argument).'
                )

            }
            if (error instanceof Error) {

                var stack = '';

                return (
                    'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
                );
            }
        }
    }
}