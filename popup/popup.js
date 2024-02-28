let selectors = {
    "sites": [
        {
            "re": "linkedin\\.com\\/jobs\\/view",
            "queries": [
                {
                    "selector": ".relative > .p5"
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
                    "selector": ".br-article"
                },
                {
                    "selector": ".br-footer"
                }
            ]
        },
        {
            "re": "indeed\\.com\\/viewjob",
            "queries": [
                {
                    "selector": ".jobsearch-InfoHeaderContainer",
                },
                {
                    "selector": "#jobDetailsSection",
                },
                {
                    "selector": "#jobDescriptionText",
                }
            ]
        }
    ]
}

const button = document.getElementById('button')
const tab = document.getElementById('tab')
const save = document.getElementById('save')
const load = document.getElementById('load')
const clear = document.getElementById('clear')
const del = document.getElementById('del')
const message = document.getElementById('message')
const qs = document.getElementsByClassName('qs')
const bookend = document.getElementById('bookend')



//  MMMMMMMM  MM    MM  MM    MM    MMMM    
//  MM        MM    MM  MMMM  MM  MM    MM  
//  MMMMMMMM  MM    MM  MM  MMMM  MM        
//  MM        MM    MM  MM    MM  MM        
//  MM        MM    MM  MM    MM  MM    MM  
//  MM          MMMM    MM    MM    MMMM    



async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

function makeDuplicable(elem) {
    function duplicate(event) {
        if (event.key === 'Enter') {
            console.log(document.querySelectorAll('.qs').length)
            if (document.querySelectorAll('.qs').length < 5) {
                let elem = document.createElement('input')
                elem.className = 'qs common'
                elem.placeholder = 'custom selector'
                makeDuplicable(elem)
                document.body.insertBefore(elem, bookend)
                this.removeEventListener('keydown', duplicate)
                elem.focus()
            }
        }
    }
    elem.addEventListener('keydown', duplicate)
}

async function handleClick(willThisOpenNewTab) {
    let currentTab = null
    const customURL = document.getElementById('urlregex').value
    const qs = []
    document.querySelectorAll('.qs').forEach((node) => {
        if (node.value) {
            qs.push({ "selector": node.value })
        }
    })
    const newSite = { "re": customURL, "queries": qs }
    if (newSite.re) {
        selectors.sites.push(newSite)
    }
    try {
        currentTab = await getCurrentTab();
        if (currentTab) {
            let supportedSiteFound = false
            selectors.sites.forEach((site) => {
                if (currentTab.url.match(new RegExp(site.re, "i"))) {
                    supportedSiteFound = true
                    message.textContent = 'testing on id:' + currentTab.id
                    chrome.scripting.executeScript({
                        target: { tabId: currentTab.id },
                        func: runScriptOnTab,
                        args: [selectors, willThisOpenNewTab]
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
}



//  MMMMMMMM  MM      MM  MMMMMMMM  MM    MM  MMMMMM  
//  MM        MM      MM  MM        MMMM  MM    MM    
//  MMMMMMMM  MM      MM  MMMMMMMM  MM  MMMM    MM    
//  MM        MM      MM  MM        MM    MM    MM    
//  MM          MM  MM    MM        MM    MM    MM    
//  MMMMMMMM      MM      MMMMMMMM  MM    MM    MM    




tab.addEventListener('click', function () {
    const willThisOpenNewTab = true
    handleClick(willThisOpenNewTab)
})

button.addEventListener('click', function () {
    const willThisOpenNewTab = false
    handleClick(willThisOpenNewTab)
})

// makeDuplicable(qs[0])
// I disabled this in favor of just having five query selector input elements always.



//    MMMM      MMMM    MMMMMM    MMMMMM  MMMMMM    MMMMMM  
//  MM    MM  MM    MM  MM    MM    MM    MM    MM    MM    
//    MM      MM        MMMMMM      MM    MM    MM    MM    
//      MM    MM        MM    MM    MM    MMMMMM      MM    
//  MM    MM  MM    MM  MM    MM    MM    MM          MM    
//    MMMM      MMMM    MM    MM  MMMMMM  MM          MM    



function runScriptOnTab(selectors, openNewTab) {
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
            left: '25%',
            width: '50%',
            borderRadius: '20px',
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
            }, 1000)
        }, 7000)

        ribbon.id = ribbonID
        ribbon.textContent = (openNewTab) ? 'RAKE attempting to open new tab' : 'RAKE not supported'
        document.body.insertBefore(ribbon, document.body.firstChild)
    }

    addRibbon(ribbonID)

    selectors.sites.forEach((site) => {
        if (tabURL.match(new RegExp(site.re, "i"))) {

            supportedSiteFound = true
            let textArray = []
            const space = '\n\n----------------------\n\n'
            site.queries.forEach((query) => {
                const elems = document.querySelectorAll(query.selector)
                elems.forEach((elem) => {
                    if (openNewTab) {
                        if (elem.outerHTML) {
                            textArray.push(elem.outerHTML)
                        }
                    } else {
                        if (elem.innerText) {
                            textArray.push(elem.innerText)
                        } else {
                            textArray.push('innerText not found for this query selector: ' + query.selector)
                        }
                    }
                })
            })
            data = (openNewTab) ? data + textArray.join('') : data + textArray.join(space) + space
        }
    })

    if (openNewTab) {
        if (data) {
            const top = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
            const title = '<title>RAKED PAGE</title></head><body>'
            const bottom = '</body></html>'
            const blob = new Blob([top + title + data + bottom], { type: 'text/html' })
            window.open(URL.createObjectURL(blob), '_blank')
        }
        if (!supportedSiteFound) {
            document.getElementById(ribbonID).textContent = 'RAKE not supported'
        }
    } else {
        if (data) {
            saveRaked(data)
            document.getElementById(ribbonID).textContent = 'Text downloaded in raked.txt'
        }
        if (!supportedSiteFound) {
            document.getElementById(ribbonID).textContent = 'RAKE not supported'
        }
    }
}