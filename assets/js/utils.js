export function captiliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function titleCase(string) {
    return string.
        toLowerCase().
        split(' ').
        map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}