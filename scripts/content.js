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

const addRibbon = () => {
    console.log('----- adding ribbon -----')
    const ribbon = document.createElement('div')

    ribbon.textContent = ' ribbon anyone?'

    ribbon.style.position = 'fixed';
    ribbon.style.top = '0';
    ribbon.style.left = '0';
    ribbon.style.width = '100%';
    ribbon.style.backgroundColor = '#333';
    ribbon.style.textAlign = 'center';
    ribbon.style.color = '#fff';
    ribbon.style.padding = '10px';
    ribbon.style.zIndex = '9999';
    ribbon.id = 'ribbon'

    ribbon.addEventListener('click', function () {
        ribbon.remove();
    })

    // document.body.appendChild(ribbon)
    document.body.insertBefore(ribbon, document.body.firstChild)
}




let supportedSiteFound = false


// --------------------------------------------------------

addRibbon()

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


