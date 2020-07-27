import { IdentifiableObject, UntypedTuple } from './entity.model';

export interface Node extends IdentifiableObject {
  index?: number;
  attributes?: UntypedTuple;

  x?: number;
  y?: number;

  vx?: number;
  vy?: number;

  fx?: number | null;
  fy?: number | null;
}
