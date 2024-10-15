import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'PABudget-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
})
export class GraphComponent implements OnInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;

  nodesDrawList: any = [];

  ngOnInit(): void {
    this.createLayeredGraph();
  }

  createLayeredGraph() {
    const data = {
      nodes: [
        { id: 'Layer 1 Node 1', layer: 1 },
        { id: 'Layer 1 Node 2', layer: 1 },
        { id: 'Layer 2 Node 1', layer: 2 },
        { id: 'Layer 2 Node 2', layer: 2 },
        { id: 'Layer 3 Node 1', layer: 3 },
      ],
      links: [
        { source: 'Layer 1 Node 1', target: 'Layer 2 Node 1' },
        { source: 'Layer 1 Node 2', target: 'Layer 2 Node 2' },
        { source: 'Layer 2 Node 1', target: 'Layer 3 Node 1' },
        { source: 'Layer 2 Node 2', target: 'Layer 3 Node 1' },
      ],
    };

    const width = 600;
    const height = 400;

    const svg = d3
      .select(this.graphContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const layers = [...new Set(data.nodes.map(d => d.layer))];
    const layerScale = d3
      .scalePoint<number>()
      .domain(layers)
      .range([50, width - 50]);

    // رسم لینک‌ها
    svg
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('x1', d => {
        debugger;
        return layerScale(this.findNode(data.nodes, d.source)?.layer) || 0;
      })
      .attr(
        'x2',
        d => layerScale(this.findNode(data.nodes, d.target)?.layer) || 0
      )
      .attr('y1', d => (height / 4) * this.findNode(data.nodes, d.source).layer)
      .attr('y2', d => (height / 4) * this.findNode(data.nodes, d.target).layer)
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    // رسم گره‌ها
    svg
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => {
        return this.returnNodesScale(layerScale, d);
      })
      .attr('cy', d => (height / 4) * d.layer)
      .attr('r', 50)
      .attr('fill', '#4f81bd');

    // اضافه کردن متن به گره‌ها
    svg
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('x', d => layerScale(d.layer) || 0)
      .attr('y', d => (height / 4) * d.layer + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.id);
  }

  findNode(nodes: any, id: any) {
    return nodes.find((node: any) => node.id === id);
  }

  returnNodesScale(layerScale: any, nodeData: any): number {
    const fltr = this.nodesDrawList.filter(
      (x: any) => x.layer === nodeData.layer
    );
    if (fltr.length === 0) {
      const arr = {
        layer: nodeData.layer,
        cx: layerScale(nodeData.layer),
      };
      this.nodesDrawList.push(arr);
      return arr.cx;
    } else {
      const arr = {
        layer: nodeData.layer,
        cx: fltr[fltr.length - 1].cx + 250,
      };
      this.nodesDrawList.push(arr);
      return arr.cx;
    }
  }
}
