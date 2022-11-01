import { schemeSet1, schemeSet2, schemeSet3 } from 'd3-scale-chromatic'

export function categoricalColorGenerator(allData) {
    const colors = schemeSet1.concat(schemeSet2).concat(schemeSet3)
    let dataSet = new Set(allData)
    let data = [...dataSet]
    data.sort()
    // map data to value
    let colorMap = {}
    for (let index = 0; index < data.length; index++) {
        if (data[index] !== null) {
            colorMap[data[index]] = colors[index]
        }
    }
    const colorFunc = function (input) {
        if (input === null || input == "") {
            return "#808080"
        } else {
            return colorMap[input]
        }
    }

    return colorFunc
}

export function addColors(color, data) {
    const colors = schemeSet3.concat(schemeSet1).concat(schemeSet2)
    let colorMap = {}

    for (let index = 0; index < data.length; ++index) {
        if (color(data[index]) === undefined) {
            colorMap[data[index]] = colors[index]
        } else {
            colorMap[data[index]] = color(data[index])
        }
    }
    const colorFunc = function (input) {
        if (input === null) {
            return "#808080"
        } else {
            return colorMap[input]
        }
    }

    return colorFunc
}

export function convertHexToRgba(hex, alpha=1){
    let r = parseInt(hex.slice(1, 3), 16)
    let g = parseInt(hex.slice(3, 5), 16)
    let b = parseInt(hex.slice(5, 7), 16)

    return 'rgba('+r+', ' + g + ', ' + b + ', ' + alpha + ')'
}

