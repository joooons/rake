const button = document.getElementById('button')
const url = document.getElementById('url')
const message = document.getElementById('message')

const linkedinRe = /linkedin\.com\/jobs\/view/;
const chromeRe = /chrome/;
const otherRe = /geeksfor/;

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

message.textContent = 'chrome extention Rake loaded'

button.addEventListener('click', async function () {
    const currentTab = await getCurrentTab();

    if (currentTab) {
        url.textContent = currentTab.url

        if (chromeRe.test(currentTab.url)) {
            message.textContent = 'testing on id:' + currentTab.id
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                files: ['./scripts/content.js']
            }).then(() => {
                message.textContent = 'script executed'
            });
        }

        if (otherRe.test(currentTab.url)) {
            message.textContent = 'testing on id:' + currentTab.id
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                files: ['./scripts/content.js']
            }).then(() => {
                message.textContent = 'script executed'
            });
        }

        if (linkedinRe.test(currentTab.url)) {
            message.textContent = 'running script on id:' + currentTab.id
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                files: ['./scripts/content.js']
            }).then(() => {
                message.textContent = 'script executed'
            });
        }
    }
});