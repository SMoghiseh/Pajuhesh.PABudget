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
  source: string;
  target: string;
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

  constructor(private httpService: HttpService) {}

  ngOnInit(): void {
    this.getPlanDetail();
  }

  createLayeredGraph(data: data) {
    const width = this.getNodeCount(data) * 250;
    const height = 800;

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

    this.createNodesList(data.nodes, layerScale, height);

    // رسم لینک‌ها
    svg
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('x1', d => {
        return this.returnCXNodesScale(d.source);
      })
      .attr('x2', d => {
        return this.returnCXNodesScale(d.target);
      })
      .attr('y1', d => {
        return this.returnCYNodesScale(d.source);
      })
      .attr('y2', d => {
        return this.returnCYNodesScale(d.target);
      })
      .attr('stroke', 'black')
      .attr('stroke-width', 2);

    svg
      .selectAll('circle')
      .data(data.nodes)
      .enter()
      .append('circle')
      .attr('cx', (d: any) => {
        return this.returnCXNodesScale(d.id);
      })
      .attr('cy', d => {
        return this.returnCYNodesScale(d.id);
      })
      .attr('r', 70)
      .attr('fill', '#4f81bd');

    // اضافه کردن متن به گره‌ها
    svg
      .selectAll('text')
      .data(data.nodes)
      .enter()
      .append('text')
      .attr('x', (d: any) => {
        return this.returnCXNodesScale(d.id);
      })
      .attr('y', d => (height / 5) * d.layer + 5)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .text(d => d.title);
  }

  findNode(nodes: any, id: any) {
    return nodes.find((node: any) => node.id === id);
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
          cx: layerScale(1) + 50,
          cy:
            nodeData.layer === 1
              ? (h / 5) * nodeData.layer
              : (h / 5) * nodeData.layer + nodeData.layer,
        };
        this.nodesDrawList.push(arr);
        return arr.cx;
      } else {
        const arr = {
          layer: nodeData.layer,
          id: nodeData.id,
          cx: fltr[fltr.length - 1].cx + 250,
          cy: fltr[fltr.length - 1].cy,
        };
        this.nodesDrawList.push(arr);
      }
    });
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

  //     returnLinkScale(layerScale: any, layer: number): number {
  //     const fltr= this.linkDrawList.filter((x: any)=>x.layer === layer);
  //     if (fltr.length === 0) {
  //       const arr = {
  //         layer: nodeData.layer,
  //         id: nodeData.id,
  //         cx: layerScale(nodeData.layer),
  //         cy: (h / 4) * nodeData.layer,
  //       };
  //       this.nodesDrawList.push(arr);
  //       return arr.cx;
  //     } else {
  //       const arr = {
  //         layer: nodeData.layer,
  //         id: nodeData.id,
  //         cx: fltr[fltr.length - 1].cx + 250,
  //         cy: (h / 4) * nodeData.layer,
  //       };
  //       this.nodesDrawList.push(arr);
  //       return arr.cx;
  //     layerScale(layer)
  //   }
  // }
}
