import { Node } from './node.model';
import { IdentifiableObject } from './entity.model';

export interface Edge extends IdentifiableObject {

  // NB: index is assigned internally by force, once initialized it is defined
  index?: number;
  nodes: Node[];
  sources?: IdentifiableObject[];
  sinks?: IdentifiableObject[];

}

export interface BinaryEdge extends IdentifiableObject {
  index?: number;
  from: string | Node;
  to: string | Node;
}
