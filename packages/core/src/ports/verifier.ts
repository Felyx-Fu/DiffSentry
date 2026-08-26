export interface Verifier<TContext, TResult> {
  readonly id: string;
  supports(context: TContext): boolean;
  run(context: TContext): Promise<TResult>;
}
