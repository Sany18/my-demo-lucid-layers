const initData = {
  framerate: {
    min: 999,
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
    platform: '',
    framerate: 0,
    connection: {
      effectiveType: '',
      downlink: 0,
      rtt: 0,
    }
  }
}

export class PerformanceMeasurementService {
  data = structuredClone(initData);

  started = false;

  constructor() {}

  start() {
    this.getBrowserData();
    this.started = true;
    this.measureFramerate();
  }

  end() {
    this.started = false;
    console.log('Performance Measurement Data:', this.data);
    // Here you can send the data to a server or save it locally
  }

  reset() {
    this.data = structuredClone(initData);
    this.started = false;
  }

  private async getBrowserData() {
    this.data.browser.name = navigator.userAgent;
    this.data.browser.platform = navigator.platform;
    this.data.browser.framerate = await this.getSystemFramerate();
    // @ts-ignore
    this.data.browser.connection = navigator.connection;
  }

  private async getSystemFramerate(): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = 'https://www.w3schools.com/html/mov_bbb.mp4';
      video.addEventListener('loadedmetadata', () => {
        const framerate = video.getVideoPlaybackQuality().totalVideoFrames / video.duration;
        resolve(framerate);
      });
      video.load();
    });
  }

  private measureFramerate() {
    const measurementPeriod = 500;
    const startTime = performance.now();

    let lastPeriodTime = 0;
    let lastPariodFramesAmount = 0;
    let previousTime = performance.now();
    let totalFrames = 0;
    let isFirstFrame = true;

    const frame = () => {
      if (!this.started) return;

      const now = performance.now();
      const delta = now - previousTime;
      previousTime = now;

      // Skip the first frame to avoid initial spike
      // (the first cycle previousTime is 0)
      if (isFirstFrame) {
        isFirstFrame = false;
        requestAnimationFrame(frame);
        return;
      }

      lastPeriodTime += delta;
      ++lastPariodFramesAmount;
      ++totalFrames;

      const timeDiff = lastPeriodTime - measurementPeriod;
      if (timeDiff >= 0) {
        // frames per second calculation
        const rate = lastPariodFramesAmount * (1000 / lastPeriodTime);
        lastPeriodTime = timeDiff;
        lastPariodFramesAmount = 0;

        // Log the framerate for the period
        this.data.framerate.min = Math.min(this.data.framerate.min, rate);
        this.data.framerate.max = Math.max(this.data.framerate.max, rate);
        this.data.framerate.avarage = totalFrames / ((now - startTime) / 1000);

        console.log(`Framerate: ${this.data.framerate.avarage.toFixed(2)} FPS (Min: ${this.data.framerate.min.toFixed(2)}, Max: ${this.data.framerate.max.toFixed(2)})`);
      }

      requestAnimationFrame(frame);
    }

    frame();
  }
}
