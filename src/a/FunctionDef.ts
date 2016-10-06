export enum ParameterType {
  color, string, number, noParameter
}
export enum FunctionReturnType {
  string, number, void
}
export interface IDefinition {
  name: string,
  expectedTypeParameter: ParameterType,
  areBothChildrenAllowed: boolean,
  returnedValueType: FunctionReturnType
}

export let definitions: IDefinition[] = [
  {
    name: 'tl',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'tr',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'fw',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'bw',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'r',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: true,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'pu',
    expectedTypeParameter: ParameterType.noParameter,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'pd',
    expectedTypeParameter: ParameterType.noParameter,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'pcolor',
    expectedTypeParameter: ParameterType.color,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  },
  {
    name: 'pwidth',
    expectedTypeParameter: ParameterType.number,
    areBothChildrenAllowed: false,
    returnedValueType: FunctionReturnType.void
  }];
