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

const button = document.getElementById('button')
const url = document.getElementById('url')
const message = document.getElementById('message')

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

message.textContent = 'chrome extention RAKE loaded'

button.addEventListener('click', async function () {
    let currentTab = null
    try {
        currentTab = await getCurrentTab();
        if (currentTab) {
            url.textContent = currentTab.url
            let supportedSiteFound = false
            selectors.sites.forEach((site) => {
                if (currentTab.url.match(site.re)) {
                    supportedSiteFound = true
                    message.textContent = 'testing on id:' + currentTab.id
                    chrome.scripting.executeScript({
                        target: { tabId: currentTab.id },
                        files: ['./scripts/content.js']
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
        message.textContent = 'I have not seen this catch condition being triggered yet'
    }
});