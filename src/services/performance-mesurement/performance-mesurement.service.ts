const initData = {
  framerate: {
    min: Infinity,
    max: 0,
    avarage: 0,
    record: [] as { fps: number, timestamp: number }[],
  },
  browser: {
    platform: '',
    userAgent: '',
    parsedUserAgent: {} as Record<string, string>,
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
    this.showReport();
    // Here you can send the data to a server or save it locally
  }

  reset() {
    this.data = structuredClone(initData);
    this.started = false;
  }

  private async getBrowserData() {
    this.data.browser.platform = navigator.platform;
    this.data.browser.userAgent = navigator.userAgent;
    this.data.browser.parsedUserAgent = this.parseNavigatorAgent(navigator.userAgent);
    // @ts-ignore
    this.data.browser.connection = navigator.connection;
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
      if (!this.started) {
        // The last call ended is here
        this.data.browser.framerate = Math.round(this.data.framerate.max);
        return;
      }

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
        const rate = +(lastPariodFramesAmount * (1000 / lastPeriodTime)).toFixed(2);
        const record = { fps: rate, timestamp: Math.round(now - startTime) };

        this.data.framerate.record.push(record);

        // Log the framerate for the period
        this.data.framerate.min = Math.min(this.data.framerate.min, rate);
        this.data.framerate.max = Math.max(this.data.framerate.max, rate);
        this.data.framerate.avarage = +(totalFrames / ((now - startTime) / 1000)).toFixed(2);

        lastPeriodTime = timeDiff;
        lastPariodFramesAmount = 0;

        this.showReport();
      }

      requestAnimationFrame(frame);
    }

    frame();
  }

  private parseNavigatorAgent(userAgent): Record<string, string> {
    const match = userAgent.match(/^([^ ]+) \(([^)]+)\) ([^ ]+ \([^)]+\)) (.+)$/);
    const [_, product, system, engine, browser] = match;

    return {
      product,
      system,
      engine,
      browser
    };
  }

  private showReport() {
    const element = document.querySelector('.Map');
    element.querySelector('#performance-report')?.remove();

    const reportEl = document.createElement('div');
    reportEl.id = 'performance-report';
    reportEl.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      max-height: 100svh;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      z-index: 1000;
      overflow: auto;
      padding: 0.5rem 1rem;
    `;

    reportEl.innerHTML = `
      ${!this.started ? "<button style='float: right; color: red; background: transparent; border: none; font-size: 1.5rem;' onclick='this.parentElement.remove()'>X</button>" : ''}
      <h2 style='color: orange;'>Performance Measurement Report</h2>
      <h3 style='color: lightgreen;'>Browser Information</h3>
      <p><strong>Platform:</strong> ${this.data.browser.platform}</p>
      <p><strong>Browser:</strong> ${this.data.browser.parsedUserAgent.browser}</p>
      <p><strong>System:</strong> ${this.data.browser.parsedUserAgent.system}</p>
      <p><strong>Engine:</strong> ${this.data.browser.parsedUserAgent.engine}</p>
      <h3 style='color: lightgreen;'>Connection</h3>
      <p><strong>Effective Type:</strong> ${this.data.browser.connection.effectiveType}</p>
      <p><strong>Downlink:</strong> ${this.data.browser.connection.downlink} Mbps</p>
      <p><strong>RTT:</strong> ${this.data.browser.connection.rtt} ms</p>
      <h3 style='color: lightgreen;'>Framerate</h3>
      <p><strong>Min:</strong> ${this.data.framerate.min} fps</p>
      <p><strong>Max:</strong> ${this.data.framerate.max} fps</p>
      <p><strong>Avarage:</strong> ${this.data.framerate.avarage} fps</p>
      ${!this.started ? "<h3 style='color: lightgreen;'>Check the console for details</h3>" : ''}
    `;

    element.appendChild(reportEl);
  }
}
