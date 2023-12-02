export function divide(n, m) {
    const rem = n % m;
    return [(n - rem) / m, rem];
}

export function mod(n, m) {
    return (n - (n % m)) / m;
}