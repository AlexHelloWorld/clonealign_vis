import React, { Component } from 'react'
import './App.css'
import { drawChromosomeHeatmap } from './Heatmap.js'
import { categoricalColorGenerator, drawHeatmapRowAnnotation } from './HeatmapAnnotation'
import { select } from 'd3-selection'

class Figure extends Component {
    constructor(props) {
        super(props)
        this.createFigure = this.createFigure.bind(this)
    }
    componentDidMount() {
        this.createFigure()
    }
    componentDidUpdate() {
        this.createFigure()
    }
    createFigure() {
        const node = this.node
        const data = require(this.props.data)

        const canvasMap = select(node)
            .attr("class", "canvas-plot")
            .attr("width", 2000)
            .attr("height", 2000)

        const context = canvasMap.node().getContext('2d')

        const columnAnnotations = ["clonealign_tree_id", "clonealign_clone_id", "sample_id"]

        let colors = columnAnnotations.slice()
        colors.forEach(function (value, index) { this[index] = categoricalColorGenerator(data.cnv_meta[this[index]]) }, colors)

        const annotationDimensions = drawHeatmapRowAnnotation(context, colors, data.cnv_meta, columnAnnotations, 1, 15, 5)

        context.save()
        context.translate(annotationDimensions[0] + 10, 0)

        const dimensions = drawChromosomeHeatmap(context, color, data.cnv_matrix, 1, 1)

        context.restore()

    }

    render() {
        return <canvas ref={node => this.node = node}></canvas>
    }
}

export default Heatmap