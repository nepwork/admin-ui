import { EdgeStream, Edge } from './edge.model';
import { NodeStream, Node } from './node.model';
import { Observable } from 'rxjs';

export type IdStream = Observable<string | unknown>;

export type ModelStream = IdStream | EdgeStream<Edge> | NodeStream<Node> ;

export type KDBModelStream<T> = Observable<ModelStream | IdStream | [ModelStream, T]>;

export type KDBStream<T> = KDBModelStream<T | KDBModelStream<ModelStream>>;

export type UserStream = KDBStream<IdStream>;

export type PipeStream = KDBStream<UserStream>;

export type CosmosStream = kDBStream<PipeStream>;
