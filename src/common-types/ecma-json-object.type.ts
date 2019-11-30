import { EcmaModel } from './ecma-model.type';

export type EcmaJsonObject = { [prop: string]: EcmaModel | EcmaModel[] };
