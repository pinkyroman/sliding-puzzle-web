export function queryElement(selector) {
    const elem = document.querySelector(selector);
    if (elem == null) {
        throw new Error(`failed to find element: '${selector}'`);
    }
    return elem;
}

export function load(url, parentElement) {
    return new Promise((resolve, reject) => {
        fetch(url).then(response => {
            if (response.ok) {
                return response.text().then(text => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(text, "text/html");
                    const $contents = doc.getElementsByTagName('body')[0];
                    const $fragments = new DocumentFragment();
                    
                    $fragments.replaceChildren(...$contents.children);
                    parentElement.appendChild($fragments);                    
                    
                    //TODO: styleshteets 처리
                    //TODO: scripts 처리

                    resolve();
                });    
            }
            reject(`${response.status} ${response.statusText}`);
        }).catch(error => {
            reject(error);
        });        
    });
}