const linkedin = /linkedin\.com\/jobs\/view/;

const url = window.document.URL

const saveRaked = (text) => {
    console.log('------ downloading text ------')
    const fileName = "raked.txt"
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

if (linkedin.test(url)) {
    console.log('Rake works on', url);

    const summary = document.getElementsByClassName('p5')
    const about = document.getElementById('job-details')

    let summaryText = (summary) ? summary[0].innerText : "No Summary Data"
    let aboutText = (about) ? about.innerText : "No About Data"

    const text = summaryText + '\n\n----------------------\n\n' + aboutText

    saveRaked(text)
} else {
    console.log('Rake does not work on', url);
}





