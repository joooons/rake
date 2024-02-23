// let img = 'https://bit.ly/4bHcA0l'

const re = /(notnewspage)/;
const url = window.document.URL

if (re.test(url)) {
    console.log('Rake works on', url);
    const para = document.getElementsByClassName('br-article-title')
    if (para) {
        para[0].textContent = 'NOPE'
        console.log(para[0].textContent)
    }
} else {
    console.log('Rake does not work on', url);
}





