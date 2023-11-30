export function divide(n, m) {
    const rem = n % m;
    return [(n-rem) / m, rem];
}