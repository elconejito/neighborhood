const formatRelativeDistance = (distance, unit = null) => {
    const feet = distance * 3.28084;
    const yards = feet / 3;
    const miles = yards / 1760;

    if (unit) {
        if (unit === 'ft') {
            return `${Math.round(feet)} ft`;
        } else if (unit === 'yd') {
            return `${Math.round(yards)} yd`;
        } else if (unit === 'mi') {
            return `${miles.toFixed(1)} mi`;
        }
    }

    if (feet < 150) {
        return `${Math.round(feet)} ft`;
    } else if (miles < 1) {
        return `${Math.round(yards)} yd`;
    } else {
        return `${miles.toFixed(1)} mi`;
    }
}

export { formatRelativeDistance };
