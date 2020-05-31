// select chart element
const chart = document.querySelector(".chart")
const r = 20 // radius for circle

// create canvas to draw on it
const canvas = document.createElement("canvas")
canvas.width = 50
canvas.height = 50

// append canvas to chart
chart.appendChild(canvas)

// get context from canvas and draw on it
const ctx = canvas.getContext("2d")
ctx.lineWidth = 8

const drawCircle = function(color, ratio, antiClockWise) {
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, r, 0, ratio * 2 * Math.PI, antiClockWise)
    ctx.stroke()
}

const updateChart = function(income, outcome) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    let ratio = outcome / income

    drawCircle("#FFFFFF", -ratio, false)
    drawCircle("#F06240", 1 - ratio, true)
}