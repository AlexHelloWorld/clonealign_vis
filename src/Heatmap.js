import { scaleLinear } from 'd3-scale'

export function drawChromosomeHeatmap(context, color, heatmapData, cellWidth = 1, cellHeight = 1, padding = 2, drawTick = false) {
  // context draw heatmap and return the width and height of the heatmap
  function xOffset(i) {
    let offset = 0;
    for (let index = 0; index < i; ++index) {
      offset += cellWidth * heatmapData[index].value[0].length + padding
    }
    return offset;
  }

  // x axis ticks with canvas
  function drawTick(index) {
    context.beginPath()
    context.fillStyle = "black"
    context.fillRect((xOffset(index) + xOffset(index + 1)) / 2, 0, 1, index % 2 === 1 ? 10 : 20)
  }

  function drawTickText(index) {
    context.textAlign = "center"
    context.fillStyle = "#000000"
    context.font = cellWidth * 24 + "px Arial"
    context.fillText(heatmapData[index].chr, (xOffset(index) + xOffset(index + 1)) / 2, index % 2 === 1 ? 30 : 43)
  }

  function drawHeatmapCell(x, y, color) {
    context.beginPath()
    context.fillStyle = color
    context.fillRect(x, y, cellWidth, cellHeight)
  }

  function drawHeatmapChromosome(chr_index) {
    context.save()
    context.translate(xOffset(chr_index), 0)
    const chr_data = heatmapData[chr_index].value
    for (let y_index = 0; y_index < chr_data.length; ++y_index) {
      for (let x_index = 0; x_index < chr_data[0].length; ++x_index) {
        drawHeatmapCell(x[chr_index](x_index), y(y_index), color(chr_data[y_index][x_index]))
      }
    }
    context.restore()
  }


  const columnAnnotations = [...Array(heatmapData.length).keys()]

  const x = columnAnnotations.map(c => scaleLinear()
    .domain([0, heatmapData[c].value[0].length])
    .rangeRound([0, cellWidth * heatmapData[c].value[0].length]))

  const y = scaleLinear()
    .domain([0, heatmapData[0].value.length])
    .rangeRound([0, cellHeight * heatmapData[0].value.length])

  const heatmapWidth = xOffset(columnAnnotations[columnAnnotations.length - 1]) + heatmapData[columnAnnotations.length - 1].value[0].length * cellWidth
  const heatmapHeight = cellHeight * heatmapData[0].value.length

  // draw ticks
  context.save()
  context.translate(0, heatmapHeight)

  columnAnnotations.forEach(index => {
    drawTick(index)
  })

  // draw tick texts
  columnAnnotations.forEach(index => {
    drawTickText(index)
  })
  context.restore()

  // draw heatmap chromosome by chromosome
  columnAnnotations.forEach(index => {
    drawHeatmapChromosome(index)
  })

  return [heatmapWidth, heatmapHeight]
}
