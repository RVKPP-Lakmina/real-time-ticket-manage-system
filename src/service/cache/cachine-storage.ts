/* eslint-disable @typescript-eslint/no-explicit-any */
export class CachedStorege {
  private cacheMap: Map<string, any> = new Map<string, any>();

  public static instance: CachedStorege = new CachedStorege();

  public get(key: string) {
    if (this.cacheMap.has(key)) {
      return this.cacheMap.get(key);
    } else {
      return null;
    }
  }

  public store(key: string, value: any) {
    this.cacheMap.set(key, value);
  }

  public remove(key: string) {
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key);
    }
  }

  public removeAll() {
    this.cacheMap.clear();
  }
}
