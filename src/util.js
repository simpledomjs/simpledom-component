

export function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}


export function dasherize(what) {
    return what.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
}

export function flatten(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.reduce(
        (one, two) => one.concat(Array.isArray(two) ? flatten(two) : two), []
    );
}