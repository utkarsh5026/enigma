const MAX_ITERATIONS = 1000000;

export class LoopContext {
  private loopDepth: number = 0;

  constructor(loopDepth: number) {
    this.loopDepth = loopDepth;
  }

  public getLoopDepth(): number {
    return this.loopDepth;
  }

  public enterLoop(): void {
    this.loopDepth++;
  }

  public exitLoop(): void {
    if (this.loopDepth <= 0) {
      throw new Error("Loop depth is already 0");
    }
    this.loopDepth--;
  }

  public isInLoop(): boolean {
    return this.loopDepth > 0;
  }

  public isMaxIterationsReached(): boolean {
    return this.loopDepth >= MAX_ITERATIONS;
  }
}
