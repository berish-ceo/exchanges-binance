export async function tryAttempts<T>(callback: () => Promise<T>, maxAttempts: number): Promise<T> {
  let error: any = null;
  let currentAttempt = 0;
  do {
    try {
      const result = await callback();

      return result;
    } catch (err) {
      error = err;
      currentAttempt++;
    }
  } while (currentAttempt < maxAttempts);

  throw error;
}
