export function queryElement(selector) {
    const elem = document.querySelector(selector);
    if (elem == null) {
        throw new Error(`failed to find element: '${selector}'`);
    }
    return elem;
}

export function load(selector, url) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();

        request.responseType = 'document';
        request.open('GET', url, true);
        request.onload = () => {            
            if (request.status == 200) {
                try {
                    const $contents = request.responseXML.querySelector('body').children;
                    queryElement(selector).replaceChildren(...$contents);

                    // TODO: stylesheets, scripts 등
                    resolve();
                } catch (e) {
                    reject(e);
                }                
            } else {
                reject(`${request.status} ${request.statusText}`);
            }
        };
        request.send();
    });
}
