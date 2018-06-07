"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isFunction = isFunction;
exports.dasherize = dasherize;
exports.flatten = flatten;
function isFunction(object) {
    return !!(object && object.constructor && object.call && object.apply);
}

function dasherize(what) {
    return what.replace(/([A-Z])/g, function ($1) {
        return "-" + $1.toLowerCase();
    });
}

function flatten(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.reduce(function (one, two) {
        return one.concat(Array.isArray(two) ? flatten(two) : two);
    }, []);
}