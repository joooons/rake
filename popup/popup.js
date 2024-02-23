const button = document.getElementById('button')

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

button.addEventListener('click', async function () {
    const currentTab = await getCurrentTab();
    if (currentTab) {
        chrome.scripting.executeScript({
            target: { tabId: currentTab.id },
            files: ['./scripts/content.js']
        }).then(() => {
            console.log('script executed in the current tab');
        });
    }
});