const now = new Date()
const clock = document.getElementById('clock')
clock.innerHTML = now.toLocaleTimeString()
setInterval(() => {
    const now = new Date()
    const clock = document.getElementById('clock')
    clock.innerHTML = now.toLocaleTimeString()
}, 1 * 1000)