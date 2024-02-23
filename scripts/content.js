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
            "re": new RegExp("linkedin\\.com\\/jobs\\/collections\\/recommended", "i"),
            "queries": [
                {
                    "selector": "[class*='job-details-jobs-unified-top-card']"
                },
                {
                    "selector": "[class*='jobs-description-content']"
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
        },
        {
            "re": new RegExp("notnewspage", "i"),
            "queries": [
                {
                    "selector": ".br-article-title"
                }
            ]
        }
    ]
}

const saveRaked = (text) => {
    const fileName = "raked.txt"
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const addRibbon = (url, ribbonID) => {
    const ribbon = document.createElement('div')
    const props = {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        textAlign: 'center',
        padding: '20px',
        zIndex: '9999',
        backgroundColor: 'aquamarine',
        color: '#333',
        fontSize: '16px'
    }
    Object.assign(ribbon.style, props)
    ribbon.addEventListener('click', () => {
        ribbon.remove();
    })
    ribbon.id = ribbonID
    ribbon.textContent = 'RAKE not supported on ' + url
    document.body.insertBefore(ribbon, document.body.firstChild)
}

const url = window.document.URL
const ribbonID = 'rake-ribbon-gibberish-souplantatious'
let supportedSiteFound = false

// --------------------------------------------------------

addRibbon(url, ribbonID)
selectors.sites.forEach((site) => {
    if (url.match(site.re)) {
        const ribbon = document.getElementById(ribbonID)
        ribbon.textContent = 'downloading some text from ' + url
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
    const ribbon = document.getElementById(ribbonID)
    ribbon.textContent = 'Rake not supported on ' + url
}


