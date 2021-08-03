import React, { Component } from 'react'
import './App.css'
import { drawChromosomeHeatmap } from './Heatmap.js'
import { categoricalColorGenerator, drawHeatmapRowAnnotation } from './HeatmapAnnotation'
import { drawHeatmapPhylo } from './Phylo'
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
        
    }
    createFigure() {
        const node = this.node
        const data = this.props.data

        const canvasMap = select(node)
            .attr("class", "canvas-plot")
            .attr("width", 2000)
            .attr("height", 2000)

        const context = canvasMap.node().getContext('2d')

        // draw phylo tree
        let phyloDims = drawHeatmapPhylo(context, data.tree, 200, 1)

        context.save()
        context.translate(phyloDims[0], 0)

        const columnAnnotations = ["clonealign_tree_id", "clonealign_clone_id", "sample_id"]

        let colors = columnAnnotations.slice()
        colors.forEach(function (value, index) { this[index] = categoricalColorGenerator(data.cnv_meta[this[index]]) }, colors)

        const annotationDimensions = drawHeatmapRowAnnotation(context, colors, data.cnv_meta, columnAnnotations, 1, 15, 5)

        context.restore()

        context.save()
        context.translate(phyloDims[0] + annotationDimensions[0] + 10, 0)

        let color = function (n) {
            const color_map = ["#3182BD", "#9ECAE1", "#CCCCCC", "#FDCC8A", "#FC8D59", "#E34A33",
                "#B30000", "#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA"]
            return color_map[n]
        }


        const dimensions = drawChromosomeHeatmap(context, color, data.cnv_matrix, 1, 1)

        context.restore()

    }

    render() {
        return <canvas ref={node => this.node = node}></canvas>
    }
}

export default Figure