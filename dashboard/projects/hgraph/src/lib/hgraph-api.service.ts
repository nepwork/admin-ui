import { Injectable } from '@angular/core';
import { HgraphService } from './hgraph.service';
import { Graph } from './model/hgraph.model';


@Injectable({
  providedIn: 'root'
})
export class HgraphApiService {

  constructor(private graphService: HgraphService) {}

  updateInMemoryGraph(g: Graph, remove = false): Graph {
    this.graphService.updateNodes(g.nodes, remove);
    this.graphService.updateEdges(g.edges, remove);
    return this.graphService.graph;
  }

}
