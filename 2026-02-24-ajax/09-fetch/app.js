const loadList = async () => {
    try {
        const response = await fetch('/list.html')
        const result = await response.text()
        document.getElementById('list').innerHTML = result
    } catch (e) {
        console.log(e)
    }
}