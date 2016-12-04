
export function flatten(array) {
    if (!Array.isArray(array)) {
        return array;
    }
    return array.reduce(
        (one, two) => one.concat(Array.isArray(two) ? flatten(two) : two), []
    );
}