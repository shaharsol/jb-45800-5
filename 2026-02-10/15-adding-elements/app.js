function colorAmet() {
    // we don't want to navigate DOM this way... it's too hard... tedious
    // const span = document.body.children[0].children[1].children[0].children[2].children[0]

    // this is the BEST approach to obtaining the right html element to manipulate
    const span = document.getElementById('amet')

    // span.style = "color: red;"
    span.className = 'red'

    // however, i can access elements in the dom using CSS selectors
    // use it if you dont have access to add id's to the HTML
    const otherSpan = document.querySelector('p > span')
    otherSpan.className = 'red'
    
    const allTheParagraphs = document.querySelectorAll('p')
    console.log(allTheParagraphs)

}

// we want to add a <p> to the <div> with some text
function changeStatusComplicated() {

    const newParagraph = document.createElement('p')
    newParagraph.innerText = 'Independence day'

    const statusDiv = document.getElementById('status')

    statusDiv.appendChild(newParagraph)
}

function changeStatusFun() {
    const statusDiv = document.getElementById('status')
    statusDiv.innerHTML = '<p class="red">Independence <span id="new-span" style="color:blue;">Day</span></p>'

    document.getElementById('new-span').style = "text-decoration: underline;"
}

