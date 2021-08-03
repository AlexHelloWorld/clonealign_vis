import { hierarchy, cluster, tree} from "d3-hierarchy";
import { categoricalColorGenerator } from "./HeatmapAnnotation";
import { pie } from "d3-shape"

export function drawHeatmapPhylo(context, data, phyloWidth, cellHeight, cluster=true, nodePieCharts=null, color=null, scaleTo = 50, outerRingWidth = 3, padding = 2){

  function separation1(a, b) {
    return a.parent == b.parent ? cellHeight : cellHeight
  }
  
  const tree = data => {
    const root = hierarchy(data);
    if(cluster){
      return cluster().nodeSize([cellHeight , phyloWidth / (root.height + 1)]).separation(separation1)(root);
    }else{
      return tree().nodeSize([cellHeight , phyloWidth / (root.height + 1)]).separation(separation1)(root);
    }
    
  }  

  // draw lines connecting each node in phylo tree
  function drawLines(descendant){
    if("children" in descendant){
      // calculate joint point
      let minChildY = Infinity;
      let minChildX = Infinity;
      let maxChildX = -minChildX
      for(let index = 0; index < descendant.children.length; index += 1){
        if(descendant.children[index].y < minChildY) minChildY = descendant.children[index].y
        if(descendant.children[index].x < minChildX) minChildX = descendant.children[index].x
        if(descendant.children[index].x > maxChildX) maxChildX = descendant.children[index].x
      }
      let jointY = (descendant.y + minChildY)/2

      context.beginPath()
      context.moveTo(descendant.y, descendant.x)
      context.lineTo(jointY, descendant.x)
      context.moveTo(jointY, minChildX)
      context.lineTo(jointY, maxChildX)
      for(let index = 0; index < descendant.children.length; index += 1){
        context.moveTo(jointY, descendant.children[index].x)
        context.lineTo(descendant.children[index].y, descendant.children[index].x)
      }
      context.stroke()
    }
  }

  const root = tree(data);

  let x0 = Infinity;
  let x1 = -x0;
  root.each(d => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  let y0 = Infinity;
  let y1 = -y0;
  root.each(d => {
    if (d.y > y1) y1 = d.y;
    if (d.y < y0) y0 = d.y;
  });  
    

  context.save()
  context.translate(0, -x0)

  // draw phylogenetic tree
  root.descendants().forEach(drawLines);

  if(nodePieCharts !== null){
    drawNodePieCharts(context, nodePieCharts, root, color, scaleTo, outerRingWidth, padding)
  }
  context.restore()

  return [phyloWidth, x1 - x0]
}


function drawNodePieCharts(context, data, treeData, color, scaleTo = 100, outerRingWidth = 10, padding = 3){
    let arcs = {}
    for (let index = 0; index < data.length; ++index) {
      arcs[data[index].name] = {}
      arcs[data[index].name].inner = data[index].value
  
      let total_count = 0
      for (let j = 0; j < data[index].value.length; ++j) {
        total_count += data[index].value[j].value
      }
      arcs[data[index].name].outer = [{"name":data[index].name, "value":total_count}]    
    }
    
    const pie = pie()
      .padAngle(0.005)
      .sort(null)
      .value(d => d.value)
  
    // draw outer ring
    function drawOuterRing(context, dataOuter, color, scale, x, y){
      const data = pie(dataOuter)
      for (let index = 0; index < data.length; ++index) {
        context.beginPath()
        context.fillStyle = color(data[0].data.name)
        context.arc(x, y, data[index].value / scale + outerRingWidth + padding, data[index].startAngle,  data[index].endAngle, true)
        context.arc(x, y, data[index].value / scale + padding, data[index].startAngle, data[index].endAngle, false)
        context.fill()  
      }
    }
  
    // draw inner pie
    function drawInnerPie(context, dataOuter, dataInner, color, scale, x, y){
      const data = pie(dataInner)
      const radius = dataOuter[0].value
      for (let index = 0; index < data.length; ++index) {
        context.beginPath()
        context.fillStyle = color(data[index].data.name)
        context.moveTo(x, y)
        context.arc(x, y, radius / scale, data[index].startAngle,  data[index].endAngle, false)
        context.lineTo(x, y)
        context.fill()
      }
    }  
  
  
    const descendants = treeData.descendants()
  
    // find the maximum radius
    const maxRadius = Math.max.apply(Math, Object.values(arcs).map(x =>x.outer[0].value))
    const scale = maxRadius / scaleTo
  
    descendants.forEach(
     descendant => {
      if(descendant.data.name in arcs){
        drawOuterRing(context, arcs[descendant.data.name].outer, color, scale, descendant.y, descendant.x)
        
        drawInnerPie(context, arcs[descendant.data.name].outer,arcs[descendant.data.name].inner, color, scale, descendant.y, descendant.x)
      }     
     }
    )
    
    
  }  