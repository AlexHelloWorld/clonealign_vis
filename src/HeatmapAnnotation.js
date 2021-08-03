export function drawHeatmapRowAnnotation(context, colors, annotationData, annotationColumns, cellHeight = 1, cellWidth = 1, padding = 2) {
  function drawAnnotationCell(x, y, color) {
    context.beginPath()
    context.fillStyle = color
    context.fillRect(x, y, cellWidth, cellHeight)
  }

  function drawOneAnnotationLabel(x, y, label) {
    context.save()
    context.translate(x, y)
    context.fillStyle = "black"
    context.textAlign = "right";
    context.font = cellWidth + "px Arial"
    let width = context.measureText(label).width
    context.rotate(3 * Math.PI / 2)
    context.fillText(label, 0, 0)
    context.restore()
    return width
  }

  function xOffset(index) {
    return index * (padding + cellWidth)
  }

  function drawOneAnnotation(columnIndex, color, annotationDataColumn) {
    annotationDataColumn.forEach((value, index) => {
      drawAnnotationCell(xOffset(columnIndex), index * cellHeight, color(value))
    })
  }


  const annotationWidth = annotationColumns.length * cellWidth + (annotationColumns.length - 1) * padding
  let annotationHeight = annotationData[annotationColumns[0]].length * cellHeight


  let textHeight = 0
  // draw annotation columns
  annotationColumns.forEach((columnName, columnIndex) => {
    drawOneAnnotation(columnIndex, colors[columnIndex], annotationData[columnName])
    textHeight = Math.max(drawOneAnnotationLabel(xOffset(columnIndex) + cellWidth, annotationHeight + 5, columnName), textHeight)
  })

  annotationHeight = annotationHeight + textHeight + 5

  return [annotationWidth, annotationHeight]


}
