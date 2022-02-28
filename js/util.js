export function queryElement(selector) {
    const elem = document.querySelector(selector);
    if (elem == null) {
        throw new Error(`failed to find element: '${selector}'`);
    }
    return elem;
}