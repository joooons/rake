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

const saveRawTextButton = document.getElementById('button')
const openNewTabButton = document.getElementById('tab')

const genButton = document.getElementById('generate')
const savButton = document.getElementById('sav')
const lodButton = document.getElementById('lod')
const delaButton = document.getElementById('dela')

const saveButton = document.getElementById('save')
const loadButton = document.getElementById('load')
const clearButton = document.getElementById('clear')
const deleteButton = document.getElementById('del')
const urlregexInputElem = document.getElementById('urlregex')
const messageElem = document.getElementById('message')
const bookendElem = document.getElementById('bookend')

const cookieName = 'rakeJSON'



//  MMMMMMMM  MM    MM  MM    MM    MMMM    
//  MM        MM    MM  MMMM  MM  MM    MM  
//  MMMMMMMM  MM    MM  MM  MMMM  MM        
//  MM        MM    MM  MM    MM  MM        
//  MM        MM    MM  MM    MM  MM    MM  
//  MM          MMMM    MM    MM    MMMM    



async function getCurrentTab() {
    // NOTE: if the user navigates to a different tab or window, this will not work
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
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
    currentTab = await getCurrentTab();
    if (currentTab) {
        let supportedSiteFound = false
        selectors.sites.forEach((site) => {
            if (currentTab.url.match(new RegExp(site.re, "i"))) {
                supportedSiteFound = true
                messageElem.textContent = 'testing on id:' + currentTab.id
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    func: runScriptOnTab,
                    args: [selectors, willThisOpenNewTab]
                }).then(() => {
                    messageElem.textContent = 'script executed'
                });
            }
        })
        if (!supportedSiteFound) {
            messageElem.textContent = 'URL not supported'
        }
    }
}





const inputToJSONstring = () => {
    const re = urlregexInputElem.value.replaceAll(".", "\\.").replaceAll("/", "\\/")
    const qs = [...document.querySelectorAll('.qs')].filter((elem) => { return elem.value.length > 0 }).map((elem) => { return { "selector": elem.value } })
    const site = {
        "re": re,
        "queries": qs
    }
    return (re) ? JSON.stringify(site) : ''
}

const useJSONstringToFillInputFields = (jsonString) => {
    const site = JSON.parse(jsonString)
    urlregexInputElem.value = site.re
    document.querySelectorAll('.qs').forEach((elem) => { elem.value = '' })
    site.queries.forEach((obj, index) => {
        document.querySelectorAll('.qs')[index].value = obj.selector
    })
}



async function getArrayFromCookie() {
    const name = cookieName
    const jsonString = document.cookie.substring(name.length + 1)
    const jsonObj = JSON.parse(jsonString)
    return jsonObj.sites
}


async function addInputToCookie() {
    const re = urlregexInputElem.value

    if (!re) {
        messageElem.textContent = 'url regex is empty'
        return
    }

    let currentTab = await getCurrentTab();

    try {
        if (currentTab.url.match(new RegExp(re, "i"))) {
            let sites = await getArrayFromCookie()
            const remaining = sites.filter((site) => {
                return (currentTab.url.match(new RegExp(site.re, "i"))) ? false : true
            })

            const qs = [...document.querySelectorAll('.qs')].filter((elem) => { return elem.value.length > 0 }).map((elem) => { return { "selector": elem.value } })
            const site = {
                "re": re,
                "queries": qs
            }

            remaining.push(site)
            const cookieString = `{"sites":` + JSON.stringify(remaining) + `}`

            messageElem.textContent = cookieString

            saveStringToCookie(cookieString)

        } else {
            messageElem.textContent = 'url regex does not match current url'
        }
    } catch {
        messageElem.textContent = 'unable to get the current tab url'
    }



}





async function saveStringToCookie(cookieString) {
    const name = cookieName
    if (cookieString) {
        let date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        document.cookie = name + '=' + cookieString + '; expires=' + date.toUTCString() + '; path=/'
        messageElem.textContent = 'url regex and selectors saved in cookie'
    } else {
        messageElem.textContent = 'nothing to save because url regex input field is empty'
    }
}

async function loadInputFromCookie() {
    let currentTab = await getCurrentTab();
    let sites = await getArrayFromCookie()
    const site = sites.filter((site) => {
        return (currentTab.url.match(new RegExp(site.re, "i"))) ? true : false
    })
    if (site.length > 0) {
        urlregexInputElem.value = site[0].re
        document.querySelectorAll('.qs').forEach((elem) => { elem.value = '' })
        site[0].queries.forEach((obj, index) => {
            document.querySelectorAll('.qs')[index].value = obj.selector
        })
        messageElem.textContent = 'selectors loaded from cookie'
    } else {
        messageElem.textContent = 'cookie contains no selectors for this url'
    }
}

function loadCookie() {
    const name = cookieName
    const jsonString = document.cookie
    if (jsonString) {
        useJSONstringToFillInputFields(jsonString.substring(name.length + 1))
        messageElem.textContent = 'url regex and selectors loaded from cookie'
        messageElem.textContent = jsonString
    } else {
        messageElem.textContent = 'no cookie to load'
    }
}

function clearInputFields() {
    urlregexInputElem.value = ''
    document.querySelectorAll('.qs').forEach((elem) => { elem.value = '' })
    messageElem.textContent = 'input fields cleared'
}

function deleteCookie() {
    const name = cookieName
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearInputFields()
    messageElem.textContent = 'cookie deleted'
}



//  MMMMMMMM  MM      MM  MMMMMMMM  MM    MM  MMMMMM  
//  MM        MM      MM  MM        MMMM  MM    MM    
//  MMMMMMMM  MM      MM  MMMMMMMM  MM  MMMM    MM    
//  MM        MM      MM  MM        MM    MM    MM    
//  MM          MM  MM    MM        MM    MM    MM    
//  MMMMMMMM      MM      MMMMMMMM  MM    MM    MM    



window.addEventListener('load', function () {
    console.log('something')
    // loadCookie()
})


genButton.addEventListener('click', function () {
    console.log('----- generate -----')
    let cookieString = `{"sites":[{"re":"geeks","queries":[{"selector":"nav"}]},{"re":"notnewspage","queries":[{"selector":".br-footer"}]},{"re":"indeed","queries":[{"selector":"#jobDetailsSection"}]}]}`
    saveStringToCookie(cookieString)
})

savButton.addEventListener('click', function () {
    console.log('----- fake save -----')
    addInputToCookie()
})

lodButton.addEventListener('click', function () {
    console.log('----- fake lod -----')
    loadInputFromCookie()
})

delaButton.addEventListener('click', function () {
    console.log('----- dela -----')
})



saveButton.addEventListener('click', function () {
    console.log('----- save button clicked -----')
    // saveStringToCookie(inputToJSONstring())
})

loadButton.addEventListener('click', function () {
    console.log('----- load button clicked -----')
    // loadCookie()
})

clearButton.addEventListener('click', function () {
    console.log('----- clear button clicked -----')
    clearInputFields()
})

deleteButton.addEventListener('click', function () {
    console.log('----- delete button clicked -----')
    deleteCookie()
})

saveRawTextButton.addEventListener('click', function () {
    const willThisOpenNewTab = false
    handleClick(willThisOpenNewTab)
})

openNewTabButton.addEventListener('click', function () {
    const willThisOpenNewTab = true
    handleClick(willThisOpenNewTab)
})





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