const button = document.getElementById('button')
const url = document.getElementById('url')
const message = document.getElementById('message')

const linkedinRe = /linkedin\.com\/jobs\/view/;

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

console.log('chrome extention Rake loaded')

button.addEventListener('click', async function () {
    const currentTab = await getCurrentTab();

    if (currentTab) {
        url.textContent = currentTab.url

        if (linkedinRe.test(currentTab.url)) {
            message.textContent = 'attempting download...'
            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                files: ['./scripts/content.js']
            }).then(() => {
                console.log('script executed in the current tab');
            });
        } else {
            message.textContent = 'not supported'
        }
    }
});