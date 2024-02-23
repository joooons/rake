const selectors = {
    "sites": [
        {
            "re": new RegExp("linkedin\\.com\\/jobs\\/view", "i"),
            "queries": [
                {
                    "selector": ".p5"
                },
                {
                    "selector": "#job-details"
                }
            ]
        },
        {
            "re": new RegExp("geeksforgeeks", "i"),
            "queries": [
                {
                    "selector": "nav"
                }
            ]
        }
    ]
}

// console.log(selectors)



const linkedin = /linkedin\.com\/jobs\/view/;

const url = window.document.URL

const saveRaked = (text) => {
    console.log('------ downloading text ------')
    const fileName = "raked.txt"
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}


console.log(selectors.sites[1].re)

if (url.match(selectors.sites[1].re)) {
    console.log('it work')
}

let supportedSiteFound = false

selectors.sites.forEach((site) => {

    if (url.match(site.re)) {
        console.log('Rake works on', url);
        supportedSiteFound = true

        let textArray = []

        site.queries.forEach((query) => {
            let text = document.querySelector(query.selector).innerText
            textArray.push(text)
        })
        let data = textArray.join('\n\n----------------------\n\n')

        saveRaked(data)
    }

})

if (!supportedSiteFound) {
    console.log('Rake not supported on', url);
}


