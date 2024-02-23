const button = document.getElementById('button')

button.addEventListener('click', function () {
    alert('poppy at least does this')
    // chrome.scripting.executeScript({
    //     target: { tabId: getTabId() },
    //     files: ['script.js']
    // }).then(() => { console.log('script works') })
})