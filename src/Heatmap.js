import React, { Component } from 'react'
import './App.css'
import { scaleLinear } from 'd3-scale'
import { max, min, range} from 'd3-array'
import { select } from 'd3-selection'
class Heatmap extends Component {
   constructor(props){
      super(props)
      this.createHeatmap = this.createHeatmap.bind(this)
   }
   componentDidMount() {
      this.createHeatmap()
   }
   componentDidUpdate() {
      this.createHeatmap()
   }
   createHeatmap() {
      const node = this.node
      console.log("data: " + this.props.data)
      const data = require(this.props.data)

      

      const width = 2500
      const padding = 2
      const margin = ({top: 20, right: 1, bottom: 40, left: 40})
      const cell_width = 1
      const cell_height = 2
      const innerHeight = cell_height * data[0].value.matrix.length
      const columnAnnotations = [...Array(data.length).keys()]

      const y = scaleLinear()
         .domain([0, data[0].value.matrix.length])
         .rangeRound([margin.top, margin.top + innerHeight])


      const x = columnAnnotations.map(c => scaleLinear()
         .domain([0, data[c].value.matrix[0].length])
         .rangeRound([0, cell_width * data[c].value.matrix[0].length]))

      const color1 = function(n){
         const color_map = ["#3182BD", "#9ECAE1", "#CCCCCC", "#FDCC8A", "#FC8D59", "#E34A33",
         "#B30000", "#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA"]
         return color_map[n]
      }

      const x_offset = function(i){
         let offset = 0;
         for (let index = 0; index < i; ++index) {
            offset += cell_width * data[index].value.matrix[0].length + padding
         }
         return offset;
      }

      let currentMax = data[0].value.matrix[0][0]
      let currentMin = data[0].value.matrix[0][0]
      for (let index = 0; index < data.length; ++index) {
       currentMax = Math.max(currentMax, max(data[0].value.matrix, d => max(d)))
       currentMin = Math.max(currentMin, min(data[0].value.matrix, d => min(d)))
      }

      const colorLimits = [currentMin, currentMax]  


      const canvasMap = select(node)
        .attr("width", width)
        .attr("height", innerHeight + margin.top + margin.bottom)
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
        .attr("class", "canvas-plot")

      const context = canvasMap.node().getContext('2d')
        

      // x axis ticks with canvas
      function drawTick(index){
        context.beginPath()
        context.fillStype = "black"
        context.fillRect((x_offset(index) + x_offset(index + 1))/2, 0, 1, index % 2 === 1 ? 10 : 20)
      }

      context.save()
      context.translate(0, innerHeight + margin.top)

      columnAnnotations.forEach(index => {
        drawTick(index)
      })

      context.restore()


      
      function drawTickText(index){
        context.textAlign = "center"
        context.fillText(data[index].chr, (x_offset(index) + x_offset(index + 1))/2, index % 2 === 1 ? 25 : 35)
      }

      context.save()
      context.translate(0, innerHeight + margin.top)

      columnAnnotations.forEach(index => {
        drawTickText(index)
      })      
      context.restore()


      function drawHeatmapCell(x, y, color){
        context.beginPath()
        context.fillStyle = color
        context.fillRect(x, y, cell_width, cell_height)        
      }

      function drawHeatmapChromosome(chr_index){
        context.save()
        context.translate(x_offset(chr_index), 0)
        const chr_data = data[chr_index].value.matrix
        for(let y_index = 0; y_index < chr_data.length; ++y_index){
          for(let x_index = 0; x_index < chr_data[0].length; ++x_index){
            drawHeatmapCell(x[chr_index](x_index), y(y_index), color1(chr_data[y_index][x_index]))
          }
        }
        context.restore()
      }

      columnAnnotations.forEach(index => {
        drawHeatmapChromosome(index)
      })

   }

   render() {
         return <canvas ref={node => this.node = node}></canvas>
   }
}

export default Heatmap