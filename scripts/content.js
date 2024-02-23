const re = /(notnewspage)/;
const other = /(google)/;
const url = window.document.URL

if (re.test(url)) {
    console.log('Rake works on', url);
    const para = document.getElementsByClassName('br-article-title')
    if (para) {
        para[0].textContent = 'NOPE'
        console.log(para[0].textContent)
    }
} else if (other.test(url)) {
    console.log('Rake works on', url);

    const text = "testing only"
    const fileName = "raked.txt"
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

} else {
    console.log('Rake does not work on', url);
}





