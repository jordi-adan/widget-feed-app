export class Result<T> {
  private constructor(
    private readonly success: boolean,
    private readonly value?: T,
    private readonly error?: string
  ) {}

  public static ok<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  public static fail<T>(error: string): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }

  public getValue(): T {
    if (!this.success) {
      throw new Error('Cannot get value from failed result');
    }
    return this.value!;
  }

  public getError(): string {
    if (this.success) {
      throw new Error('Cannot get error from successful result');
    }
    return this.error!;
  }
}
