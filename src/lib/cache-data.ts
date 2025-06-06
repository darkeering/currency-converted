export const JudgetExpire = (cacheKey: string, cacheExpire = 60 * 60 * 1000) => {
  const now = Date.now();
  const cache = localStorage.getItem(cacheKey);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cacheData: { data: any; timestamp: number } | null = null;
  if (cache) {
    try {
      cacheData = JSON.parse(cache);
    } catch {
      cacheData = null;
    }
  }
  if(cacheData && now - cacheData.timestamp < cacheExpire) {
    return cacheData
  } else {
    return null
  }
};
