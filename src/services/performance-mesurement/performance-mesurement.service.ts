const initData = {
  browser: {
    platform: '',
    userAgent: '',
    framerate: 0,
    connection: {
      effectiveType: '',
      downlink: 0,
      rtt: 0,
    },
    GPU: {
      vendor: 'unknown',
      renderer: 'unknown',
    }
  },
  WebGLSupport: false,
  framerate: {
    min: Infinity,
    max: 0,
    avarage: 0,
    record: [] as { fps: number, timestamp: number }[],
  },
}

export class PerformanceMeasurementService {
  data = structuredClone(initData);

  started = false;

  constructor() {}

  async start() {
    this.started = true;
    this.getBrowserData();
    await this.measureFramerate();
  }

  end() {
    this.started = false;
    console.info('Performance Measurement Data:', this.data);
    this.showReport();
    // Here you can send the data to a server or save it locally

    const timestamp = new Date().toISOString();
    // @ts-ignore
    window.saveReport = () => this.saveJsonToFile(this.data, `performance-measurement_${timestamp}.json`);
  }

  reset() {
    this.data = structuredClone(initData);
    this.started = false;
  }

  private async getBrowserData() {
    const navigator = window.navigator as any;

    this.data.browser.platform = navigator.platform;
    this.data.browser.userAgent = navigator.userAgent;
    this.data.browser.connection = {
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0,
      rtt: navigator.connection?.rtt || 0,
    }
    this.data.WebGLSupport = this.checkWebGLSupport();

    const gpuInfo = this.getGPUInfo();
    this.data.browser.GPU.vendor = gpuInfo.vendor;
    this.data.browser.GPU.renderer = gpuInfo.renderer;
  }

  private async measureFramerate() {
    return new Promise<void>((resolve) => {
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
          this.showReport();
          resolve();
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
        }

        requestAnimationFrame(frame);
      }

      frame();
    });
  }
  private showReport() {
    const element = document.querySelector('.Map');
    element.querySelector('#performance-report')?.remove();

    const reportEl = document.createElement('div');
    reportEl.id = 'performance-report';
    reportEl.style.cssText = `
      gap: 1rem;
      top: 0;
      left: 0;
      color: white;
      width: 100vw;
      height: 100svh;
      padding: 0.5rem 1rem;
      display: flex;
      z-index: 10001;
      overflow: auto;
      position: fixed;
      max-height: 100svh;
      background: rgba(0, 0, 0, 0.8);
    `;

    reportEl.innerHTML = `
      <div style='color: red; font-size: 1.5rem; cursor: pointer;' onclick='this.parentElement.remove()'>X</div>
      <div style='overflow: auto;'>
        <h2 style='color: lightgray;'>Performance Measurement Report</h2>

        <h3 style='color: lightgreen;'>Browser Information</h3>
        <p><strong>Platform:</strong> ${this.data.browser.platform}</p>
        <p><strong>Browser: product, system, engine, browser:</strong></p>
        <p>${this.data.browser.userAgent}</p>
        <p><strong>GPU Renderer:</strong> ${this.data.browser.GPU.renderer}</p>
        <p><strong>GPU Vendor:</strong> ${this.data.browser.GPU.vendor}</p>

        <h3 style='color: lightgreen;'>Connection</h3>
        <p><strong>Effective Type:</strong> ${this.data.browser.connection.effectiveType}</p>
        <p><strong>Downlink:</strong> ${this.data.browser.connection.downlink} Mbps</p>
        <p><strong>RTT:</strong> ${this.data.browser.connection.rtt} ms</p>

        <h3 style='color: lightgreen;'>Framerate</h3>
        <p><strong>Min:</strong> ${this.data.framerate.min} fps</p>
        <p><strong>Max:</strong> ${this.data.framerate.max} fps</p>
        <p><strong>Avarage:</strong> ${this.data.framerate.avarage} fps</p>

        <button onclick=window.saveReport()>Save to file</button>
      </div>
      <div style='flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding: 1rem; gap: 1rem;'>
        FPS over time:
        <canvas id='framerate-chart' style='width: 100%; height: 300px;'></canvas>
      </div>
    `;

    element.appendChild(reportEl);
    this.drawFramerateChart();
  }

  private saveJsonToFile(jsonData: Record<string, any>, filename: string) {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  private getGPUInfo(): { vendor: string; renderer: string } {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as any;
    if (!gl) return { vendor: 'unknown', renderer: 'unknown' };

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      return { vendor, renderer };
    }
    return { vendor: 'unknown', renderer: 'unknown' };
  }

  private drawFramerateChart() {
    // Render the framerate chart
    const canvas = document.getElementById('framerate-chart') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const chartData = this.data.framerate.record;
    if (chartData.length === 0) return;

    // Find min and max values for scaling
    const maxFps = this.data.framerate.max + 10; // Add a buffer for better visibility
    const maxTime = chartData[chartData.length - 1].timestamp;

    // Chart styling
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add vertical padding
    const padding = 10;
    const chartHeight = canvas.height - (padding * 2);
    const chartTop = padding;

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;

    // Draw horizontal grid lines
    for (let fps = 0; fps <= 120; fps += 20) {
      const y = canvas.height - padding - (fps / maxFps) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();

      // Label the grid line
      ctx.fillStyle = '#777';
      ctx.font = '10px Arial';
      ctx.fillText(`${fps} fps`, 5, y - 5);
    }

    // Draw the data as vertical lines
    chartData.forEach(record => {
      const x = (record.timestamp / maxTime) * canvas.width;
      const height = (record.fps / maxFps) * chartHeight;

      // Color based on framerate (red for low, green for high)
      const hue = Math.min(120, Math.max(0, (record.fps / 60) * 120));
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

      ctx.fillRect(
        x,
        canvas.height - padding - height,
        Math.max(1, canvas.width / chartData.length / 2),
        height
      );
    });
  }
}
