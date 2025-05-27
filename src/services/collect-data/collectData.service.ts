const initData = {
  framerate: {
    min: 0,
    max: 0,
    avarage: 0,
  },
  freezes: {
    count: 0,
    longest: 0,
    avarage: 0,
    framesLost: 0,
  },
  browser: {
    name: '',
    version: '',
  }
}

export class CollectDataService {
  private static instance: CollectDataService;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance(): CollectDataService {
    if (!CollectDataService.instance) {
      CollectDataService.instance = new CollectDataService();
    }
    return CollectDataService.instance;
  }

  public collectData(data: any): void {
    // Logic to collect data
    console.log('Collecting data:', data);
  }
}
