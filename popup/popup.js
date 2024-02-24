let selectors = {
    "sites": [
        {
            "re": "linkedin\\.com\\/jobs\\/view",
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
            "re": "linkedin\\.com\\/jobs\\/collections\\/recommended",
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
            "re": "geeksforgeeks",
            "queries": [
                {
                    "selector": "nav"
                }
            ]
        },
        {
            "re": "notnewspage",
            "queries": [
                {
                    "selector": ".br-article-title"
                }
            ]
        }
    ]
}

const button = document.getElementById('button')
const url = document.getElementById('url')
const message = document.getElementById('message')

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

url.textContent = 'url'
message.textContent = 'chrome extention RAKE loaded'

button.addEventListener('click', async function () {
    let currentTab = null

    const customURL = document.getElementById('urlregex').value
    const qs = []
    document.querySelectorAll('.qs').forEach((node) => {
        if (node.value) {
            qs.push({ "selector": node.value })
        }
    })

    const newSite = { "re": customURL, "queries": qs }
    console.log(newSite)

    if (newSite.re) {
        selectors.sites.push(newSite)
    }

    try {
        currentTab = await getCurrentTab();
        if (currentTab) {
            url.textContent = currentTab.url
            let supportedSiteFound = false
            selectors.sites.forEach((site) => {
                if (currentTab.url.match(new RegExp(site.re, "i"))) {
                    supportedSiteFound = true
                    message.textContent = 'testing on id:' + currentTab.id
                    chrome.scripting.executeScript({
                        target: { tabId: currentTab.id },
                        func: runScriptOnTab,
                        args: [selectors]
                    }).then(() => {
                        message.textContent = 'script executed'
                    });
                }
            })
            if (!supportedSiteFound) {
                message.textContent = 'URL not supported'
            }
        }
    } catch (error) {
        message.textContent = 'What triggers this?'
    }
});

// ---------------- script to run in current tab -------------------------------

function runScriptOnTab(selectors) {
    console.log('RAKE script running...')

    const tabURL = window.document.URL
    const ribbonID = 'rake-ribbon-gibberish-souplantatious'
    let supportedSiteFound = false
    let data = ''

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

    const addRibbon = (ribbonID) => {
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
            fontSize: '16px',
            opacity: '1',
            transition: 'opacity 2s'
        }
        Object.assign(ribbon.style, props)
        ribbon.addEventListener('click', () => {
            ribbon.remove();
        })
        setTimeout(() => {
            ribbon.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(ribbon);
            }, 2000)
        }, 10000)
        ribbon.id = ribbonID
        ribbon.textContent = 'RAKE not supported'
        document.body.insertBefore(ribbon, document.body.firstChild)
    }

    addRibbon(ribbonID)

    selectors.sites.forEach((site) => {
        if (tabURL.match(new RegExp(site.re, "i"))) {

            supportedSiteFound = true
            let textArray = []
            let space = '\n\n----------------------\n\n'
            site.queries.forEach((query) => {
                const elems = document.querySelectorAll(query.selector)
                elems.forEach((elem) => {
                    if (elem.innerText) {
                        textArray.push(elem.innerText)
                    } else {
                        textArray.push('innerText not found for this query selector: ' + query.selector)
                    }
                })
            })
            data = data + textArray.join(space) + space
        }
    })

    saveRaked(data)

    if (data) {
        document.getElementById(ribbonID).textContent = 'Text downloaded in raked.txt'
    }

    if (!supportedSiteFound) {
        document.getElementById(ribbonID).textContent = 'RAKE not supported'
    }
}