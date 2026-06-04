const askChatGPT = async (event) => {
    
    event.preventDefault()

    const apiKey = document.getElementById("api-key").value
    const input = document.getElementById("query").value

    try {
        const resposne = await fetch(`https://api.openai.com/v1/responses`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // MIME type of the request body
                // Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-5.2",
                input
            })
        })
        console.log(`response status is ${resposne.status}`)
        const json = await resposne.json()
        console.log(json)

        document.getElementById("answer").innerText = json.output[0].content[0].text

    } catch (e) {
        console.log(e)
    }


}