export interface Rule<TContext, TResult> {
  readonly id: string;
  supports(context: TContext): boolean;
  run(context: TContext): Promise<readonly TResult[]>;
}
