export type RefType<T extends string, Name extends T> = Name;

export type ExcludeObject<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object ? (ExcludeObject<T, U> & U) | (ExcludeObject<U, T> & T) : T | U;
export type Head<T> = T extends [infer U, ...any[]] ? U : T;
export type Tail<T> = T extends [any, ...infer U] ? (U extends [infer I] ? I : U extends [] ? never : U) : T;

export type XORArray<T extends any[]> = T extends [infer U] ? U : T extends [] ? never : XOR<Head<T>, Tail<T> extends any[] ? XORArray<Tail<T>> : Tail<T>>;
