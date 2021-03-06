import React, { Component } from 'react'
import './App.css'
import { drawChromosomeHeatmap } from './Heatmap.js'
import { drawHeatmapRowAnnotation } from './HeatmapAnnotation'
import { categoricalColorGenerator, addColors } from './CategoricalColor'
import { drawHeatmapPhylo } from './Phylo'
import { drawSankey } from './Sankey'
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
            .attr("width", 2800)
            .attr("height", 2000)

        const context = canvasMap.node().getContext('2d')

        const columnAnnotations = ["clonealign_tree_id", "clonealign_clone_id", "sample_id"]

        // generate colors for annotation columns
        let colors = columnAnnotations.slice()
        colors.forEach(function (value, index) { this[index] = categoricalColorGenerator(data.cnv_meta[this[index]]) }, colors)

        // color for cnv heatmap
        let cnvColor = function (n) {
            const color_map = ["#3182BD", "#9ECAE1", "#CCCCCC", "#FDCC8A", "#FC8D59", "#E34A33", "#B30000", "#980043", "#DD1C77", "#DF65B0", "#C994C7", "#D4B9DA"]
            return color_map[n]
        }

        // color for expr heatmap
        let exprColor = function (n) {
            const color_map = ["#08008B", "#24239B", "#4947AB", "#6D6DBB", "#9191CB", "#B6B6DD", "#DADAEE", "#FFFFFF", "#EED9DA", "#DDB6B6", "#CB9191", "#BB6D6D", "#AB4848", "#9B2424", "#8A0100"]
            return color_map[n]
        }

        // draw phylo tree with pie charts
        let pieChartColor = addColors(colors[0], data.pie_chart.map(o => o.name))
        // replace colors[0] with pieChartColor
        colors[0] = pieChartColor

        // draw phylo tree
        context.translate(0, 100)
        context.save()
        context.translate(500, 0)
        const phyloDims = drawHeatmapPhylo(context, data.tree, 1500, 1, false, data.pie_chart, pieChartColor)
        context.restore()

        // move to heatmaps
        context.save()
        context.translate(0, phyloDims[1] + 50)

        // draw heatmap annotation tree
        const heatmapPhyloDims = drawHeatmapPhylo(context, data.tree, 200, 1)

        // move to cnv heatmap column annotation
        context.translate(heatmapPhyloDims[0], 0)
        const annotationDimensions = drawHeatmapRowAnnotation(context, colors, data.cnv_meta, columnAnnotations, 1, 15, 5)

        // move to cnv heatmap
        context.translate(annotationDimensions[0] + 10, 0)
        const cnvDimensions = drawChromosomeHeatmap(context, cnvColor, data.cnv_matrix, 1, 1)

        // move to sankey graph
        context.translate(cnvDimensions[0], 0)
        const sankeyWidth = drawSankey(context, data.sankey, colors[0], 1, 1, 70, 0, 10, data.terminal_nodes)

        // move to expr heatmap column annotation
        context.translate(sankeyWidth, 0)
        const annotationExprDimensions = drawHeatmapRowAnnotation(context, colors, data.expr_meta, columnAnnotations, 1, 15, 5)


        // move to expr heatmap
        context.translate(annotationExprDimensions[0] + 10, 0)
        const exprDimensions = drawChromosomeHeatmap(context, exprColor, data.expr_matrix, 1, 1)

        context.restore()
    }

    render() {
        return <canvas ref={node => this.node = node}></canvas>
    }
}

export default Figure