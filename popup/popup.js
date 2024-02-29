const saveRawTextButton = document.getElementById('button')
const openNewTabButton = document.getElementById('tab')
const saveButton = document.getElementById('save')
const loadButton = document.getElementById('load')
const clearButton = document.getElementById('clear')
const deleteButton = document.getElementById('delete')
const deleteAllButton = document.getElementById('deleteAll')
const urlregexInputElem = document.getElementById('urlregex')
const messageElem = document.getElementById('message')
const bookendElem = document.getElementById('bookend')
const COOKIE_NAME = 'rakeJSON'



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

async function extractText(willThisOpenNewTab) {
    const customURL = document.getElementById('urlregex').value
    const qs = []
    document.querySelectorAll('.qs').forEach((node) => {
        if (node.value) {
            qs.push({ "selector": node.value })
        }
    })
    const selectors = {
        "sites": [
            { "re": customURL, "queries": qs }
        ]
    }
    let currentTab = await getCurrentTab();
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

async function saveStringToCookie(cookieString) {
    if (cookieString) {
        let date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        document.cookie = COOKIE_NAME + '=' + cookieString + '; expires=' + date.toUTCString() + '; path=/'
    } else {
        messageElem.textContent = 'nothing to save'
    }
}

async function getArrayFromCookie() {
    const jsonString = document.cookie.substring(COOKIE_NAME.length + 1)
    const jsonObj = (jsonString) ? JSON.parse(jsonString) : { "sites": [] }
    return jsonObj.sites
}

async function addInputToCookie() {
    const re = urlregexInputElem.value
    if (re) {
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
                saveStringToCookie(cookieString)
                messageElem.textContent = 'selector(s) saved to cookie'
            } else {
                messageElem.textContent = 'please type a url regex that matches the current tab url'
            }
        } catch {
            messageElem.textContent = 'unable to get the current tab url'
        }
    } else {
        messageElem.textContent = 'unable to save because url regex is empty'
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

async function deleteThisSiteFromCookie() {
    let currentTab = await getCurrentTab()
    let sites = await getArrayFromCookie()
    const remaining = sites.filter((site) => {
        return (currentTab.url.match(new RegExp(site.re, "i"))) ? false : true
    })
    if (remaining.length < sites.length) {
        const cookieString = `{"sites":` + JSON.stringify(remaining) + `}`
        saveStringToCookie(cookieString)
        messageElem.textContent = 'this url removed from cookie'
    } else {
        messageElem.textContent = 'nothing to remove'
    }
}

function deleteCookie() {
    document.cookie = COOKIE_NAME + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    clearInputFields()
    messageElem.textContent = 'cookie deleted'
}

function clearInputFields() {
    urlregexInputElem.value = ''
    document.querySelectorAll('.qs').forEach((elem) => { elem.value = '' })
    messageElem.textContent = 'input fields cleared'
}



//  MMMMMMMM  MM      MM  MMMMMMMM  MM    MM  MMMMMM  
//  MM        MM      MM  MM        MMMM  MM    MM    
//  MMMMMMMM  MM      MM  MMMMMMMM  MM  MMMM    MM    
//  MM        MM      MM  MM        MM    MM    MM    
//  MM          MM  MM    MM        MM    MM    MM    
//  MMMMMMMM      MM      MMMMMMMM  MM    MM    MM    



window.addEventListener('load', loadInputFromCookie)

saveRawTextButton.addEventListener('click', function () {
    const willThisOpenNewTab = false
    extractText(willThisOpenNewTab)
})

openNewTabButton.addEventListener('click', function () {
    const willThisOpenNewTab = true
    extractText(willThisOpenNewTab)
})

saveButton.addEventListener('click', addInputToCookie)

loadButton.addEventListener('click', loadInputFromCookie)

deleteButton.addEventListener('click', deleteThisSiteFromCookie)

deleteAllButton.addEventListener('click', deleteCookie)

clearButton.addEventListener('click', clearInputFields)



//    MMMM      MMMM    MMMMMM    MMMMMM  MMMMMM    MMMMMM  
//  MM    MM  MM    MM  MM    MM    MM    MM    MM    MM    
//    MM      MM        MMMMMM      MM    MM    MM    MM    
//      MM    MM        MM    MM    MM    MMMMMM      MM    
//  MM    MM  MM    MM  MM    MM    MM    MM          MM    
//    MMMM      MMMM    MM    MM  MMMMMM  MM          MM    



function runScriptOnTab(selectors, openNewTab) {
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
            top: '10px',
            left: '25%',
            width: '50%',
            borderRadius: '20px',
            boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.5)',
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
        ribbon.addEventListener('click', ribbon.remove)
        setTimeout(() => {
            ribbon.style.opacity = 0;
            setTimeout(() => {
                document.body.removeChild(ribbon);
            }, 1000)
        }, 7000)

        ribbon.id = ribbonID
        ribbon.textContent = (openNewTab) ? 'attempting to open new tab' : 'not supported'
        document.body.insertBefore(ribbon, document.body.firstChild)
    }
    addRibbon(ribbonID)
    selectors.sites.forEach((site) => {
        if (tabURL.match(new RegExp(site.re, "i"))) {
            supportedSiteFound = true
            let textArray = []
            const space = '\n\n'

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
                            textArray.push('<-- innerText not found for this query selector: ' + query.selector + ' -->')
                        }
                    }
                })
            })
            data = (openNewTab) ? textArray.join('') : textArray.join(space)
        }
    })

    if (openNewTab) {
        if (data) {
            const top = '<!DOCTYPE html><html><head><meta charset="UTF-8">'
            const title = '<title>RAKED PAGE</title></head><body>'
            const bottom = '</body></html>'
            const blob = new Blob([top + title + data + bottom], { type: 'text/html' })
            window.open(URL.createObjectURL(blob), '_blank')
        } else {
            document.getElementById(ribbonID).textContent = 'Nothing to extract'
        }
        if (!supportedSiteFound) {
            document.getElementById(ribbonID).textContent = 'RAKE not supported'
        }
    } else {
        if (data) {
            saveRaked(data)
            document.getElementById(ribbonID).textContent = 'Text downloaded in raked.txt'
        } else {
            document.getElementById(ribbonID).textContent = 'Nothing to extract'
        }
        if (!supportedSiteFound) {
            document.getElementById(ribbonID).textContent = 'RAKE not supported'
        }
    }
}