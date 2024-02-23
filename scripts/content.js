let img = 'https://bit.ly/4bHcA0l'

console.log('---------------- ok then ----------------------')

const elem = document.getElementsByTagName('h1')
const para = document.getElementsByClassName('br-article-title')


if (para) {
    para[0].textContent = 'NOPE'
}

para[0].textContent = 'NOPE'

console.log(para[0].textContent)

