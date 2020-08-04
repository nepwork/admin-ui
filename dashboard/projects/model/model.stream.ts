import { EdgeStream, Edge } from './edge.model';
import { NodeStream, Node } from './node.model';
import { IdStream } from '../identity/src/lib/identity.service';

export type ModelStream = IdStream | EdgeStream<Edge> | NodeStream<Node> ;
