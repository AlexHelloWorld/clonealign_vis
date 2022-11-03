import React, { Component } from 'react'
import './App.css'
import { drawChromosomeHeatmap } from './Heatmap.js'
import { drawHeatmapRowAnnotation } from './HeatmapAnnotation'
import { categoricalColorGenerator, addColors} from './CategoricalColor'
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

        const columnAnnotations = ["clonealign_tree_id"]

        let expr_length = data.expr_matrix[0].value.length
        let cnv_length = data.cnv_meta[columnAnnotations[0]].length 

        const canvas_length = Math.max(expr_length, cnv_length)

        const canvasMap = select(node)
            .attr("class", "canvas-plot")
            .attr("width", 4000)
            .attr("height", canvas_length  + 200)

        const context = canvasMap.node().getContext('2d')


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
            const color_map = ["#08008B", "#24239B", "#4947AB", "#6D6DBB", "#9191CB", "#B6B6DD", "#DADAEE", "#E7E7E7", "#EED9DA", "#DDB6B6", "#CB9191", "#BB6D6D", "#AB4848", "#9B2424", "#8A0100"]
            return color_map[n]
        }

        // draw phylo tree with pie charts
        let pieChartColor = addColors(colors[0], data.pie_chart.map(o => o.name))
        // replace colors[0] with pieChartColor
        colors[0] = pieChartColor

        // draw phylo tree
        // context.translate(0, 200)
        // context.save()
        // context.translate(500, 0)
        // const phyloDims = drawHeatmapPhylo(context, data.tree, 1000, 0.7, true, data.pie_chart, pieChartColor)
        // context.restore()
        context.translate(400, 100)
        const phyloDims = 0

        // move to heatmaps
        context.save()
        context.translate(100, phyloDims[1] + 50)

        // draw heatmap annotation tree
        const heatmapPhyloDims = drawHeatmapPhylo(context, data.tree, 450, 1, true, data.pie_chart, pieChartColor, 50, 4)

        // move to cnv heatmap column annotation
        context.translate(heatmapPhyloDims[0], 0)
        const annotationDimensions = drawHeatmapRowAnnotation(context, colors, data.cnv_meta, columnAnnotations, 1, 20, 5)

        // move to cnv heatmap
        context.translate(annotationDimensions[0] + 10, 0)
        const cnvDimensions = drawChromosomeHeatmap(context, cnvColor, data.cnv_matrix, 1, 1, 5)

        // move to sankey graph
        context.translate(cnvDimensions[0], 0)
        const sankeyWidth = drawSankey(context, data.sankey, colors[0], 1, 1, 70, 0, 10, data.terminal_nodes)

        // move to expr heatmap column annotation
        context.translate(sankeyWidth, 0)
        const annotationExprDimensions = drawHeatmapRowAnnotation(context, colors, data.expr_meta, columnAnnotations, 1, 20, 5)


        // move to expr heatmap
        context.translate(annotationExprDimensions[0] + 10, 0)
        const exprDimensions = drawChromosomeHeatmap(context, exprColor, data.expr_matrix, 1, 1, 5)

        context.restore()
    }

    render() {
        return <canvas ref={node => this.node = node}></canvas>
    }
}

export default Figure
