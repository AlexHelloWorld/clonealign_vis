export function drawSankey(context, data, color, leftHeight, rightHeight, rightStartX = 200, rightStartY = 50, columnWidth = 10, filters = null) {
    function drawRect(context, x, y, width, height, color) {
        context.fillStyle = color
        context.fillRect(x, y, width, height)
    }

    function drawFlow(x0, y0, x1, y1, x2, y2, x3, y3, color) {
        // bezier curver from (x0, y0) to (x1, y1)
        // add additional transparency to color
        if (y0 === y2 || y1 == y3) {
            return
        } else {
            context.beginPath()
            context.fillStyle = color.concat("", "80")
            context.moveTo(x0, y0)
            context.bezierCurveTo(x0, (y0 + y1) / 2, x1, (y0 + y1) / 2, x1, y1)
            context.lineTo(x3, y3)
            context.bezierCurveTo(x3, (y2 + y3) / 2, x2, (y2 + y3) / 2, x2, y2)
            context.fill()
        }
    }

    data.forEach(element => {
        // draw left annotation column
        drawRect(context, 0, element["left"][0] * leftHeight, columnWidth, (element["left"][1] - element["left"][0]) * leftHeight, color(element["name"]))

        // draw right annotation column
        drawRect(context, rightStartX, element["right"][0] * rightHeight + rightStartY, columnWidth, (element["right"][1] - element["right"][0]) * rightHeight, color(element["name"]))

        // connects two annotation
        if (filters !== null) {
            if (filters.includes(element["name"])) {
                drawFlow(columnWidth, element["left"][0] * leftHeight, rightStartX, element["right"][0] * rightHeight + rightStartY, columnWidth, element["left"][1] * leftHeight, rightStartX, element["right"][1] * rightHeight + rightStartY, color(element["name"]))
            }
        } else {
            drawFlow(columnWidth, element["left"][0] * leftHeight, rightStartX, element["right"][0] * rightHeight + rightStartY, columnWidth, element["left"][1] * leftHeight, rightStartX, element["right"][1] * rightHeight + rightStartY, color(element["name"]))
        }

    })

    return columnWidth * 2 + rightStartX
}