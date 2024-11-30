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
    const height = 500;

    const svg = d3
      .select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);


    // data.links = [
    //   {
    //     source: 10055,
    //     target: 10045
    //   },
    //   // {
    //   //   source: 10055,
    //   //   target: 10046,
    //   // },
    //   {
    //     source: 10049,
    //     target: 10048
    //   },
    //   {
    //     source: 10049,
    //     target: 10043
    //   },
    //   {
    //     source: 10048,
    //     target: 10044
    //   },
    //   {
    //     source: 10042,
    //     target: 10041
    //   },
    //   {
    //     source: 10042,
    //     target: 10049
    //   },
    //   {
    //     source: 10042,
    //     target: 10040
    //   },
    //   {
    //     source: 10041,
    //     target: 10040
    //   },
    //   {
    //     source: 10041,
    //     target: 10048
    //   },
    //   {
    //     source: 10041,
    //     target: 10049
    //   },
    //   {
    //     source: 10044,
    //     target: 10045
    //   },
    //   {
    //     source: 10044,
    //     target: 10046
    //   },
    //   {
    //     source: 10044,
    //     target: 10055
    //   },
    //   {
    //     source: 10046,
    //     target: 10055
    //   },
    //   {
    //     source: 10039,
    //     target: 10041
    //   }
    // ]

    const layers = [...new Set(data.nodes.map(d => d.layer))];
    const layerScale = d3
      .scalePoint<number>()
      .domain(layers)
      .range([50, width - 50])

    this.createNodesList(data.nodes, layerScale, height);


    //  رسم لینک برای نود های هم سطح (منحنی )
    this.drawLinesForNodesSameLevel(svg, data);

    // رسم نودها
    this.createNode(svg, data)

    // اضافه کردن متن به گره‌ها
    this.addTextToNodes(svg, data, height);

    // رسم کمانک
    this.createTarget(svg, data);


    // رسم لینک‌ برای نود های غیر هم سطح
    this.drawLinesForNodesInDifferentLevel(svg, data);

    //  رسم لینک برای نود های هم سطح (خط صاف)
    this.drawLinesForNodesPlacedNextToEachOther(svg);


  }

  drawLinesForNodesSameLevel(svg: any, data: data) {

    // Add curved links (paths)
    svg
      .selectAll('path')
      .data(data.links)
      .enter()
      .append('path')
      .attr('d', (d: any) => {
        const source = d.source;
        const target = d.target;

        if (!source || !target) return '';
        // this ignore nodes that their layers are different
        if (this.findNode(data.nodes, source).layer != this.findNode(data.nodes, target).layer) return;

        // this ignore nodes that placed next to each other 
        if (this.compareNodesIndex(source, target) == 1) {
          this.nodesPlacedNextToEachOther.push(d);
          return
        }

        // Start and end points
        const x1 = this.returnCXNodesScale(source) + 45;
        const y1 = this.returnCYNodesScale(source) + this.returnCYPath(this.findNode(data.nodes, source).layer);
        //  const y1 = this.returnCYNodesScale(source) + 65;
        const x2 = this.returnCXNodesScale(target) + 45;
        const y2 = this.returnCYNodesScale(target) + this.returnCYPath(this.findNode(data.nodes, source).layer);
        // const y2 = this.returnCYNodesScale(target) + 65;

        // Calculate a control point (midpoint with an offset)
        const cx = (x1 + x2) / 2;
        const cy = (y1 + y2) / 2 + this.returnOffsetForCurvature(this.findNode(data.nodes, source).layer); // Offset for curvature

        // Return a quadratic Bézier curve
        let quadratic = `M ${x1},${y1} Q ${cx},${cy + 10} ${x2},${y2}`
        return quadratic;

      })
      .attr('stroke', '#475569')
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', '2,2')
      .attr('marker-end', 'url(#arrowheadForPath)');
  }

  returnOffsetForCurvature(layer: number) {
    return layer == 1 ? -40 : 40;
  }

  returnCYPath(layer: number) {
    return layer == 1 ? -2 : 65;
  }

  drawLinesForNodesInDifferentLevel(svg: any, data: data) {

    // filtered data that placed  in same layer
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
        return this.returnCYNodesScale(d.source) + 25 + 35;
      })
      .attr('y2', (d: any) => {
        return this.returnCYNodesScale(d.target);
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
        return this.returnCXNodesScale(d.source);
      })
      .attr('x2', (d: any) => {
        return this.returnCXNodesScale(d.target) + 135;
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
    let differenceOfIndex = Math.abs(IndexOfSource - IndexOfTarget)
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
          cy:
            nodeData.layer === 1
              ? (h / 4) * nodeData.layer - 80
              : (h / 4) * nodeData.layer + nodeData.layer - 80,
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

  addTextToNodes(svg: any, data: data, height: any) {
    // اضافه کردن متن به گره‌ها
    svg
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('x', (d: any) => {
        return this.returnCXNodesScale(d.id) + 65;
      })
      .attr('y', (d: any) => (height / 4) * d.layer - 45)
      //      .attr('y', d => this.returnCYtext(d.layer) )
      .attr('text-anchor', 'middle')
      .attr('fill', '#4A4A4A')
      .text((d: any) => d.title);
  }

  createNode(svg: any, data: data) {
    // رسم نودها
    svg
      .selectAll('rect')
      .data(data.nodes)
      .enter()
      .append('rect')
      .attr('x', (d: any) => {
        return this.returnCXNodesScale(d.id);
      })
      .attr('y', (d: any) => {
        return this.returnCYNodesScale(d.id);
      })
      .attr('width', 130)
      .attr('height', 60)
      .attr('rx', '10')
      .attr('ry', '10')
      .attr('fill', (d: any) => {
        return this.colorScale(d.layer);
      })
      .attr('color', '#4A4A4A');
  }

  createTarget(svg: any, data: data) {
    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10') // Viewbox for the arrowhead
      .attr('refX', 5) // Position of the arrow relative to the line end
      .attr('refY', 0)
      .attr('markerWidth', 6) // Width of the arrowhead
      .attr('markerHeight', 6) // Height of the arrowhead
      .attr('orient', 'auto') // Rotate to match the line direction
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5') // Triangle shape
      .attr('fill', '#475569');

    svg.append('defs')
      .append('marker')
      .attr('id', 'arrowheadForPath')
      .attr('viewBox', '0 -5 10 10') // Viewbox for the arrowhead
      .attr('refX', 5) // Position of the arrow relative to the line end
      .attr('refY', 0)
      .attr('markerWidth', 6) // Width of the arrowhead
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
