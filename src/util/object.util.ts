import { EcmaJsonObject } from '../common-types/ecma-json-object.type';

export class ObjectUtil {

  private static instance: ObjectUtil | null = null;

  constructor() {
    if (!ObjectUtil.instance) {
      ObjectUtil.instance = this;
    }

    return ObjectUtil.instance;
  }

  assign(obj1: EcmaJsonObject, obj2: EcmaJsonObject): EcmaJsonObject {
    const obj3: EcmaJsonObject = {};

    Object.keys(obj1).forEach(key => { obj3[key] = obj1[key]; });
    Object.keys(obj2).forEach(key => { obj3[key] = obj2[key]; });

    return obj3;
  }

  clone<T extends Object>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
