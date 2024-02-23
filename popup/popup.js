const button = document.getElementById('button')
const url = document.getElementById('url')
const message = document.getElementById('message')

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

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

message.textContent = 'chrome extention RAKE loaded'

button.addEventListener('click', async function () {
    const currentTab = await getCurrentTab();

    if (currentTab) {
        url.textContent = currentTab.url

        selectors.sites.forEach((site) => {
            if (currentTab.url.match(site.re)) {
                message.textContent = 'testing on id:' + currentTab.id
                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    files: ['./scripts/content.js']
                }).then(() => {
                    message.textContent = 'script executed'
                });
            }
        })
    } else {
        message.textContent = 'RAKE not supported on ' + currentTab.url
    }
});