import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpService } from '@core/http/http.service';
import { Plan, UrlBuilder } from '@shared/models/response.model';
import * as d3 from 'd3';
import { map } from 'rxjs';

export interface Node {
  id: number;
  layer: number;
  title: string;
}
export interface link {
  source: number;
  target: number;
}
export interface data {
  nodes: Array<Node>;
  links: Array<link>;
}
@Component({
  selector: 'PABudget-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;
  @Input() inputData!: any;
  isOpenDialog = false;
  dynamicTitle = '';
  nodesDrawList: any = [];
  linkDrawList: any = [];
  grafData: any = [];
  nodesPlacedNextToEachOther: any = [];
  filteredData1: any = [];

  constructor(private httpService: HttpService) { }

  ngOnInit(): void {
    this.getPlanDetail();
  }

  createLayeredGraph(data: data) {
    const width = 1100;
    const height = 700;

    const svg = d3
      .select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);


    //data.links = [
    // {
    //   source: 10055,
    //   target: 10045
    // },
    // {
    //   source: 10049,
    //   target: 10048
    // },
    // {
    //   source: 10049,
    //   target: 10043
    // },
    // {
    //   source: 10048,
    //   target: 10044
    // },
    // {
    //   source: 10042,
    //   target: 10041
    // },
    // {
    //   source: 10042,
    //   target: 10049
    // },
    // {
    //   source: 10042,
    //   target: 10040
    // },
    // {
    //   source: 10041,
    //   target: 10040
    // },
    // {
    //   source: 10041,
    //   target: 10040
    // },
    // {
    //   source: 10041,
    //   target: 10048
    // },
    // {
    //   source: 10041,
    //   target: 10049
    // },
    // {
    //   source: 10044,
    //   target: 10045
    // },
    // {
    //   source: 10044,
    //   target: 10046
    // },
    // {
    //   source: 10044,
    //   target: 10055
    // },
    // {
    //   source: 10046,
    //   target: 10055
    // },
    // {
    //   source: 10039,
    //   target: 10041
    // },
    // {
    //   source: 10109,
    //   target: 10049
    // },

    // {
    //   source: 10111,
    //   target: 10043
    // },
    // //// bug
    // {
    //   source: 10111,
    //   target: 10112
    // },
    // {
    //   source: 10048,
    //   target: 10110
    // },
    // {
    //   source: 10045,
    //   target: 10112
    // },
    // {
    //   source: 10045,
    //   target: 10111
    // },
    // ]

    const layers = [...new Set(data.nodes.map(d => d.layer))];
    const layerScale = d3
      .scalePoint<number>()
      .domain(layers)
      .range([50, width - 50])

    this.createNodesList(data.nodes, layerScale, height);



    // رسم نودها
    this.createNode(svg, data)


    // اضافه کردن متن به گره‌ها
    // this.addTextToNodes(svg, data, height);

    /// this.addTooltip(svg, data);

    // (خط کج) رسم لینک‌ برای نود های غیر هم سطح
    this.drawLinesForNodesInDifferentLevel(svg, data);

    //  رسم لینک برای نود های هم سطح (منحنی )
    this.drawLinesForNodesSameLevel(svg, data);

    //  رسم لینک برای نود های هم سطح (خط صاف)
    this.drawLinesForNodesPlacedNextToEachOther(svg);

    // رسم کمانک
    this.createTargetOnLines(svg, data);


  }

  drawLinesForNodesSameLevel(svg: any, data: data) {

    // filtered data that placed  in same layer
    let filteredData = data.links.filter(link =>
      this.findNode(data.nodes, link.source).layer == this.findNode(data.nodes, link.target).layer
    );

    console.log(filteredData)

    // Add curved links (paths)
    svg
      .selectAll('path')
      .data(filteredData)
      .enter()
      .append('path')
      .attr('d', (d: any) => {
        const source = d.source;
        const target = d.target;
        const sourceLayer = this.findNode(data.nodes, source).layer;
        const targetLayer = this.findNode(data.nodes, target).layer;

        // this ignore nodes that placed next to each other 
        if (Math.abs(this.compareNodesIndex(source, target)) == 1) {
          this.nodesPlacedNextToEachOther.push(d);
          return
        }

        console.log(this.returnCXNodesScale(d.source))
        console.log(this.returnCXNodesScale(d.target))

        // Start and end points
        const x1 = this.returnCXNodesScale(source) + 45;
        const y1 = this.returnCYNodesScale(source) + (sourceLayer == 1 ? -2 : 63);
        const x2 = this.returnCXNodesScale(target) + 45;
        const y2 = this.returnCYNodesScale(target) + (sourceLayer == 1 ? -3 : 63);

        // Calculate a control point (midpoint with an offset)
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 + (sourceLayer == 1 ? -40 : 40); // Offset for curvature

        // Return a quadratic Bézier curve
        let quadratic = `M ${x1},${y1} Q ${cx},${cy + 10} ${x2},${y2}`
        return quadratic;

      })
      .attr('stroke', (d: any) => this.colorScale(this.findNode(data.nodes, d.source).layer))
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2')
      .attr('marker-end', 'url(#arrowheadForPath)')
      .attr('marker-end', (d: any) => `url(#arrow-${d.source}-${d.target}-path)`);


    data.links.forEach(link => {
      svg.append('defs')
        .append('marker')
        .attr('id', `arrow-${link.source}-${link.target}-path`)
        .attr('viewBox', '0 -5 10 10') // Viewbox for the arrowhead
        .attr('refX', 5) // Position of the arrow relative to the line end
        .attr('refY', 0)
        .attr('markerWidth', 4) // Width of the arrowhead
        .attr('markerHeight', 6) // Height of the arrowhead
        .attr('orient', 'auto') // Rotate to match the line direction
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5') // Triangle shape
        .attr('fill', this.colorScale(this.findNode(data.nodes, link.source).layer));
    });
  }


  drawLinesForNodesInDifferentLevel(svg: any, data: data) {
    debugger

    // filtered data that placed in different layer 
    let filteredData = data.links.filter(link =>
      this.findNode(data.nodes, link.source).layer != this.findNode(data.nodes, link.target).layer
    );

    svg
      .selectAll('line')
      .data(filteredData)
      .enter()
      .append('line')
      .attr('x1', (d: any) => {


        return this.returnCXNodesScale(d.source) + 65;
      })
      .attr('x2', (d: any) => {
        return this.returnCXNodesScale(d.target) + 65;
      })
      .attr('y1', (d: any) => {

        // this check nodes layer to check line direction  
        let TopFromBottomDirection = this.findNode(data.nodes, d.source).layer < this.findNode(data.nodes, d.target).layer ? true : false;

        return this.returnCYNodesScale(d.source) + (TopFromBottomDirection ? 60 : 0);
      })
      .attr('y2', (d: any) => {

        // this check nodes layer to check line direction  
        let TopFromBottomDirection = this.findNode(data.nodes, d.source).layer < this.findNode(data.nodes, d.target).layer ? true : false;

        return this.returnCYNodesScale(d.target) + (TopFromBottomDirection ? 0 : 60);
      })
      // .attr('stroke', '#a1a0a0')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2')
      .attr('marker-end', 'url(#arrowhead)');

  }

  drawLinesForNodesPlacedNextToEachOther(svg: any) {


    svg
      .selectAll('line.second')
      .data(this.nodesPlacedNextToEachOther)
      .enter()
      .append('line')
      .attr('x1', (d: any) => {

        // this check nodes position to check line direction  
        let LTRdirection = this.compareNodesIndex(d.source, d.target) == -1 ? true : false;

        return this.returnCXNodesScale(d.source) + (LTRdirection ? 130 : 0);
      })
      .attr('x2', (d: any) => {

        // this check nodes position to check line direction  
        let LTRdirection = this.compareNodesIndex(d.source, d.target) == -1 ? true : false;

        return this.returnCXNodesScale(d.target) + (LTRdirection ? 0 : 130);
      })
      .attr('y1', (d: any) => {
        return this.returnCYNodesScale(d.source) + 32;
      })
      .attr('y2', (d: any) => {
        return this.returnCYNodesScale(d.target) + 32;
      })
      // .attr('stroke', '#a1a0a0')
      .attr('stroke', '#475569')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2')
      .attr('marker-end', 'url(#arrowhead)');

  }

  drawShapesForTargetNodes(svg2: any, data: data) {
    const svg = d3.select('svg');
    // Identify all target nodes
    const targetIds = new Set(data.links.map(link => link.target));

    // Add nodes with conditional shapes
    svg
      .selectAll('g') // Use a group <g> for each node to support different shapes
      .data(data.nodes)
      .enter()
      .append('g')
      .each(function (d: any) {
        const group = d3.select(this);

        if (targetIds.has(d.id)) {
          // Draw rectangle for target nodes
          group
            .append('rect')
            .attr('x', d.x - 15) // Center the rectangle
            .attr('y', d.y - 15)
            .attr('width', 30)
            .attr('height', 30)
            .attr('fill', 'red')
            .attr('stroke', '#475569')
            .attr('stroke-width', 2);
        } else {
          // Draw circle for non-target nodes
          group
            .append('circle')
            .attr('cx', d.x)
            .attr('cy', d.y)
            .attr('r', 20)
            .attr('fill', 'blue')
            .attr('stroke', '#475569')
            .attr('stroke-width', 2);
        }
      });

  }


  compareNodesIndex(source: any, target: any) {
    let IndexOfSource = this.findIndexOfNode(source);
    let IndexOfTarget = this.findIndexOfNode(target);
    let differenceOfIndex = IndexOfSource - IndexOfTarget
    return differenceOfIndex;
  }

  findNode(nodes: any, id: any) {
    return nodes.find((node: any) => node.id === id);
  }

  findIndexOfNode(id: any) {
    return this.grafData.nodes.findIndex((node: any) => node.id === id);
  }

  colorScale(layerId: number) {
    let colorCode = '';

    if (layerId == 1)
      colorCode = '#88DFD5';
    if (layerId == 2)
      colorCode = '#8CEFE4';
    if (layerId == 3)
      colorCode = '#CCE0FF';
    if (layerId == 4)
      colorCode = '#97BEFF';
    return colorCode;

  }

  returnCXNodesScale(nodeId: any): number {
    const fltr = this.nodesDrawList.filter((x: any) => x.id === nodeId);
    if (fltr.length > 0) return fltr[0].cx;
    else return -1;
  }

  returnCYNodesScale(nodeId: any): number {
    const fltr = this.nodesDrawList.filter((x: any) => x.id === nodeId);
    if (fltr.length > 0) return fltr[0].cy;
    else return -1;
  }

  createNodesList(nodes: any, layerScale: any, h: number) {
    nodes.forEach((nodeData: any) => {
      const fltr = this.nodesDrawList.filter(
        (x: any) => x.layer === nodeData.layer
      );
      if (fltr.length === 0) {
        const arr = {
          layer: nodeData.layer,
          id: nodeData.id,
          cx: layerScale(1),
          // cy: this.returnYPoint(nodeData.layer, h)
          cy:
            // nodeData.layer === 1
            // ? (h / 4) * nodeData.layer - 60
            // : 
            (h / 4) * nodeData.layer + nodeData.layer - (60 * nodeData.layer),
        };
        this.nodesDrawList.push(arr);
        return arr.cx;
      } else {
        const arr = {
          layer: nodeData.layer,
          id: nodeData.id,
          cx: fltr[fltr.length - 1].cx + 150,
          cy: fltr[fltr.length - 1].cy,
        };
        this.nodesDrawList.push(arr);
      }
    });
  }

  returnYPoint(layer: number, height: number) {
    let ypoint = (height / 4) * layer;

    if (layer == 1) {
      ypoint = ypoint - 120
    }
    if (layer == 2) {
      ypoint = ypoint + layer - 120
    }
    if (layer == 3) {
      ypoint = ypoint + layer - 120
    }
    if (layer == 4) {
      ypoint = ypoint + layer - 120
    }

    return ypoint;
  }

  addTextToNodes(svg: any, data: data, h: any) {
    // اضافه کردن متن به گره‌ها
    svg
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('x', (d: any) => {
        return this.returnCXNodesScale(d.id) + 65;
      })
      .attr('y', (d: any) => (h / 4) * d.layer + d.layer - (60 * d.layer) + 30)
      //      .attr('y', d => this.returnCYtext(d.layer) )
      .attr('text-anchor', 'middle')
      .attr('fill', '#4A4A4A')
      .text((d: any) => d.title.charAt(11) ? '...' + d.title.substring(0, 18) : d.title);
  }

  createNode(svg: any, data: data) {

    // // Draw nodes as rectangles
    // svg
    // .selectAll('rect')
    // .data(data.nodes)
    // .enter()
    // .append('rect')
    // .attr('x', (d: any) => {
    //   return this.returnCXNodesScale(d.id);
    // })
    // .attr('y', (d: any) => {
    //   return this.returnCYNodesScale(d.id);
    // })
    // .attr('width', 130)
    // .attr('height', 60)
    // .attr('rx', '10')
    // .attr('ry', '10')
    // .attr('fill', (d: any) => {
    //   return this.colorScale(d.layer);
    // })


    // Tooltip container
    const tooltip = svg.append('g')
      .style('visibility', 'hidden')
      .attr('class', 'custom-graf-tooltip')
      .attr('pointer-events', 'none'); // Prevent tooltip from interfering with events

    const tooltipRect = tooltip.append('rect')
      .attr('fill', '#333')
      .attr('stroke', 'black')
      .attr('rx', 8)
      .attr('ry', 8);

    const tooltipText = tooltip.append('text')
      .attr('x', 10) // Padding inside the tooltip
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#fff')
      .style('white-space', 'pre-wrap'); // Ensure line breaks within text;

    // Draw nodes
    const nodeGroup = svg.selectAll('g.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${this.returnCXNodesScale(d.id)}, ${this.returnCYNodesScale(d.id)})`)
      .on('mouseover', function (this: SVGRectElement, event: any, d: any) {
        // tooltipText.text(d.title); // Set tooltip text
        // const bbox = tooltipText.node().getBBox(); // Get text bounding box for tooltip sizing



        // // Apply min-width and max-width constraints
        // const minWidth = 120; // Minimum width for the tooltip
        // const maxWidth = 120; // Maximum width for the tooltip
        // const dynamicWidth = Math.max(minWidth, Math.min(maxWidth, bbox.width + 20)); // Constrain width

        // // Set tooltip rectangle size
        // //      tooltipRect.attr('width', dynamicWidth).attr('height', bbox.height + 10);
        // // Set tooltip rect size
        // tooltipRect.attr('width', 100) // Fixed width for the tooltip
        //   .attr('height', bbox.height + 20); // Auto height based on text content

        // tooltip.style('visibility', 'visible'); // Show tooltip
        // tooltip.raise(); // Ensure tooltip is on top


        d3.selectAll('.node').classed('active', false); // Remove 'active' from all nodes
        d3.select(this)
          .transition()
          .duration(10) // Animate over 300ms
          .style('filter', 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))');

      })
      .on('mousemove', function (this: SVGRectElement, event: any, d: any) {
        // // Calculate tooltip position based on node corner
        // const [mouseX, mouseY] = d3.pointer(event, svg.node()); // Relative to the SVG container
        // tooltip.attr('transform', `translate(${mouseX - 40}, ${mouseY - 50})`); // Adjust for offset
       
      })
      .on('click', (event: any, d: any) => {
        debugger
        // // Calculate tooltip position based on node corner
        // const [mouseX, mouseY] = d3.pointer(event, svg.node()); // Relative to the SVG container
        // tooltip.attr('transform', `translate(${mouseX - 40}, ${mouseY - 50})`); // Adjust for offset

        this.isOpenDialog = true;
        this.dynamicTitle = d.title
       
      })
      .on('mouseout', function (this: SVGRectElement, event: any, d: any){
        //      tooltip.style('visibility', 'hidden'); // Hide tooltip
        d3.selectAll('.node').classed('active', false); // Remove 'active' from all nodes
        d3.select(this).style('filter', 'none'); // Remove shadow
      });

    // Add rectangles
    nodeGroup.append('rect')
      .attr('width', 130)
      .attr('height', 60)
      .attr('rx', '10')
      .attr('ry', '10')
      .attr('fill', (d: any) => this.colorScale(d.layer))
      .style('cursor', 'pointer') // Add pointer cursor
      .on('click', function (this: SVGRectElement, event: any, d: any) {
        d3.select(this).style('filter', 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))');
      });

    // Add text inside the nodes
    nodeGroup.append('text')
      .attr('x', 65) // Center text horizontally
      .attr('y', 35) // Center text vertically
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text((d: any) => d.title)
      .style('fill', '#000')
      .style('cursor', 'pointer') // Add pointer cursor
      .style('font-size', '12px')
      .text((d: any) => d.title.charAt(11) ? '...' + d.title.substring(0, 18) : d.title);
  }

  addTooltip(svg: any, data: any) {
    // Create tooltip elements
    const tooltip = svg.append('g')
      .style('visibility', 'hidden')
      .attr('pointer-events', 'none');

    const tooltipRect = tooltip.append('rect')
      .attr('fill', '#474747')
      .attr('stroke', '#474747')
      .attr('rx', 8)
      .attr('ry', 8);

    const tooltipText = tooltip.append('text')
      .attr('x', 10) // Padding inside the tooltip
      .attr('y', 20)
      .style('font-size', '12px')
      .style('fill', '#fff');

    // Add event listeners for tooltips
    svg
      .selectAll('rect')
      .on('mouseover', function (event: any, d: any) {
        tooltipText.text(d.title);
        tooltip.style('visibility', 'visible');
        const [mouseX, mouseY] = d3.pointer(event);
        tooltip.attr('transform', `translate(${mouseX + 10}, ${mouseY - 50})`);
        const bbox = tooltipText.node().getBBox();
        tooltipRect
          .attr('width', bbox.width + 20)
          .attr('height', bbox.height + 10);

        tooltip.raise(); // Ensure tooltip is on top
      })
      .on('mousemove', function (event: any) {
        const [mouseX, mouseY] = d3.pointer(event);
        tooltip.attr('transform', `translate(${mouseX + 10}, ${mouseY - 50})`);
      })
      .on('mouseout', function () {
        tooltip.style('visibility', 'hidden');
      });
  }

  createTargetOnLines(svg: any, data: data) {
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10') // Viewbox for the arrowhead
      .attr('refX', 5) // Position of the arrow relative to the line end
      .attr('refY', 0)
      .attr('markerWidth', 4) // Width of the arrowhead
      .attr('markerHeight', 6) // Height of the arrowhead
      .attr('orient', 'auto') // Rotate to match the line direction
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5') // Triangle shape
      .attr('fill', '#475569');
  }

  getPlanDetail() {
    const body = {
      companyId: this.inputData.companyId,
    };
    this.httpService
      .post<any>(UrlBuilder.build(Plan.apiAddressStrategyMap, ''), body)
      .pipe(
        map(response => {
          if (response.data && response.data.result) {
            return response.data.result;
          } else return [];
        })
      )
      .subscribe(res => {
        this.grafData = res;
        this.createLayeredGraph(res);
      });
  }

  getNodeCount(data: data): number {
    const arr = [];
    arr.push(data.nodes.filter((x: Node) => x.layer === 1).length);
    arr.push(data.nodes.filter((x: Node) => x.layer === 2).length);
    arr.push(data.nodes.filter((x: Node) => x.layer === 3).length);
    arr.push(data.nodes.filter((x: Node) => x.layer === 4).length);
    arr.sort();
    return arr[arr.length - 1];
  }
}
