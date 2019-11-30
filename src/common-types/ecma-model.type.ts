import { EcmaJsonObject } from './ecma-json-object.type';
import { EcmaValue } from './ecma-value.type';

export type EcmaModel = EcmaJsonObject | EcmaValue | EcmaJsonObject[] | EcmaValue[];
