export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}