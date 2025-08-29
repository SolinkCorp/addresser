export function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

export function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function createStreetDirectionalString(streetDirectional) {
    return Object.keys(streetDirectional).map(x => streetDirectional[x]).join('|');
}

export function createLine2PrefixString(line2Prefixes) {
    return Object.keys(line2Prefixes).join('|');
}

export function createStreetTypeRegex(streetTypes, streetDirectionalString) {
    return new RegExp('.*\\b(?:' + 
        Object.keys(streetTypes).join('|') + ')\\b\\.?' + 
        '( +(?:' + streetDirectionalString + ')\\b)?', 'i');
}

export function handleAddressPart(addressParts, stateString) {
    if (stateString.length > 0) {
        addressParts[addressParts.length-1] = stateString;
        return addressParts[addressParts.length-1];
    } else {
        addressParts.splice(-1,1);
        if (addressParts.length === 0) return '';
        return addressParts[addressParts.length-1].trim();
    }
}

export function findCityInList(cityList, placeString) {
    let foundCity = '';
    let remainingString = placeString;
    
    if (cityList) {
        cityList.some(function(element) {
            const re = new RegExp(element + "$", "i");
            if (placeString.match(re)) {
                remainingString = placeString.replace(re,"");
                foundCity = element;
                return true;
            }
            return false;
        });
    }
    
    return { foundCity, remainingString };
}

export function buildAddressLine1(streetNumber, streetName, streetSuffix, streetDirection) {
    let addressLine1 = streetNumber;
    if (streetName) {
        addressLine1 += ' ' + streetName;
    }
    if (streetSuffix) {
        addressLine1 += ' ' + streetSuffix;
    }
    if (streetDirection) {
        addressLine1 += ' ' + streetDirection;
    }
    return addressLine1;
}