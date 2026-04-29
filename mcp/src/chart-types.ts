// Chart.js v4 chart type metadata.
// Sourced from src/controllers/*.js and docs/charts/*.md.

export interface ChartTypeMeta {
  type: string;
  description: string;
  dataShape: string;
  defaultScales: 'cartesian' | 'radial' | 'none';
  template: Record<string, unknown>;
  docPath: string;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const sampleData = [65, 59, 80, 81, 56, 55, 40];

export const CHART_TYPES: Record<string, ChartTypeMeta> = {
  bar: {
    type: 'bar',
    description:
      'Vertical or horizontal bars. Good for comparing discrete categories. Use indexAxis: "y" for horizontal.',
    dataShape:
      'data.labels: string[]; data.datasets[].data: number[] (one value per label).',
    defaultScales: 'cartesian',
    template: {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Dataset 1',
            data: sampleData,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    },
    docPath: 'docs/charts/bar.md',
  },
  line: {
    type: 'line',
    description: 'Connected points showing trends over a continuous axis.',
    dataShape:
      'data.labels: string[]; data.datasets[].data: number[] (or {x, y} pairs for non-categorical x).',
    defaultScales: 'cartesian',
    template: {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Dataset 1',
            data: sampleData,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: { responsive: true },
    },
    docPath: 'docs/charts/line.md',
  },
  pie: {
    type: 'pie',
    description: 'Circular chart split into slices proportional to values.',
    dataShape:
      'data.labels: string[]; data.datasets[].data: number[] (one value per label).',
    defaultScales: 'none',
    template: {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: { responsive: true },
    },
    docPath: 'docs/charts/doughnut.md',
  },
  doughnut: {
    type: 'doughnut',
    description: 'Pie chart with a hole in the middle (configurable via cutout).',
    dataShape:
      'data.labels: string[]; data.datasets[].data: number[] (one value per label).',
    defaultScales: 'none',
    template: {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            label: 'Dataset 1',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)',
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: { responsive: true, cutout: '50%' },
    },
    docPath: 'docs/charts/doughnut.md',
  },
  radar: {
    type: 'radar',
    description:
      'Polygonal area chart on a radial axis. Good for multi-variate comparisons.',
    dataShape:
      'data.labels: string[] (axes); data.datasets[].data: number[] (one value per axis).',
    defaultScales: 'radial',
    template: {
      type: 'radar',
      data: {
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 90, 81, 56, 55, 40],
            fill: true,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgb(255, 99, 132)',
            pointBackgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: { responsive: true, elements: { line: { borderWidth: 3 } } },
    },
    docPath: 'docs/charts/radar.md',
  },
  polarArea: {
    type: 'polarArea',
    description:
      'Like a pie chart, but each slice has equal angle and varying radius.',
    dataShape:
      'data.labels: string[]; data.datasets[].data: number[] (one value per label).',
    defaultScales: 'radial',
    template: {
      type: 'polarArea',
      data: {
        labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [11, 16, 7, 3, 14],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(75, 192, 192)',
              'rgb(255, 205, 86)',
              'rgb(201, 203, 207)',
              'rgb(54, 162, 235)',
            ],
          },
        ],
      },
      options: { responsive: true },
    },
    docPath: 'docs/charts/polar.md',
  },
  scatter: {
    type: 'scatter',
    description: 'Points on a 2D plane. Both axes are linear by default.',
    dataShape:
      'data.datasets[].data: { x: number, y: number }[]. No data.labels (axes are numeric).',
    defaultScales: 'cartesian',
    template: {
      type: 'scatter',
      data: {
        datasets: [
          {
            label: 'Scatter Dataset',
            data: [
              { x: -10, y: 0 },
              { x: 0, y: 10 },
              { x: 10, y: 5 },
              { x: 0.5, y: 5.5 },
            ],
            backgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: {
        responsive: true,
        scales: { x: { type: 'linear', position: 'bottom' } },
      },
    },
    docPath: 'docs/charts/scatter.md',
  },
  bubble: {
    type: 'bubble',
    description:
      'Like scatter, but each point also has a radius (third dimension).',
    dataShape:
      'data.datasets[].data: { x: number, y: number, r: number }[]. r is bubble radius in pixels.',
    defaultScales: 'cartesian',
    template: {
      type: 'bubble',
      data: {
        datasets: [
          {
            label: 'First Dataset',
            data: [
              { x: 20, y: 30, r: 15 },
              { x: 40, y: 10, r: 10 },
            ],
            backgroundColor: 'rgb(255, 99, 132)',
          },
        ],
      },
      options: { responsive: true },
    },
    docPath: 'docs/charts/bubble.md',
  },
};

export function listChartTypes() {
  return Object.values(CHART_TYPES).map((m) => ({
    type: m.type,
    description: m.description,
    dataShape: m.dataShape,
    docPath: m.docPath,
  }));
}

export function getChartTemplate(type: string): ChartTypeMeta | null {
  return CHART_TYPES[type] ?? null;
}

export interface ValidationIssue {
  severity: 'error' | 'warning';
  path: string;
  message: string;
}

export function validateChartConfig(config: unknown): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return [{ severity: 'error', path: '', message: 'Config must be an object.' }];
  }
  const cfg = config as Record<string, unknown>;

  // type
  if (typeof cfg.type !== 'string') {
    issues.push({ severity: 'error', path: 'type', message: 'Missing required string field "type".' });
  } else if (!CHART_TYPES[cfg.type]) {
    issues.push({
      severity: 'error',
      path: 'type',
      message: `Unknown chart type "${cfg.type}". Valid types: ${Object.keys(CHART_TYPES).join(', ')}.`,
    });
  }

  // data
  if (!cfg.data || typeof cfg.data !== 'object' || Array.isArray(cfg.data)) {
    issues.push({ severity: 'error', path: 'data', message: 'Missing required object field "data".' });
    return issues;
  }
  const data = cfg.data as Record<string, unknown>;

  // datasets
  if (!Array.isArray(data.datasets)) {
    issues.push({
      severity: 'error',
      path: 'data.datasets',
      message: '"data.datasets" must be an array.',
    });
    return issues;
  }
  if (data.datasets.length === 0) {
    issues.push({
      severity: 'warning',
      path: 'data.datasets',
      message: '"data.datasets" is empty — chart will render nothing.',
    });
  }

  const meta = typeof cfg.type === 'string' ? CHART_TYPES[cfg.type] : undefined;

  // labels (only required for label-based types)
  const labelTypes = new Set(['bar', 'line', 'pie', 'doughnut', 'radar', 'polarArea']);
  if (meta && labelTypes.has(meta.type)) {
    if (!Array.isArray(data.labels)) {
      issues.push({
        severity: 'warning',
        path: 'data.labels',
        message: `"${meta.type}" charts usually require "data.labels" as a string array.`,
      });
    }
  }

  // per-dataset shape checks
  data.datasets.forEach((ds, i) => {
    const path = `data.datasets[${i}]`;
    if (!ds || typeof ds !== 'object') {
      issues.push({ severity: 'error', path, message: 'Dataset must be an object.' });
      return;
    }
    const d = ds as Record<string, unknown>;
    if (!('data' in d)) {
      issues.push({ severity: 'error', path: `${path}.data`, message: 'Dataset is missing "data" field.' });
      return;
    }
    if (!Array.isArray(d.data)) {
      issues.push({ severity: 'error', path: `${path}.data`, message: '"data" must be an array.' });
      return;
    }

    if (!meta) return;

    if (meta.type === 'scatter') {
      d.data.forEach((pt, j) => {
        if (!pt || typeof pt !== 'object' || typeof (pt as any).x !== 'number' || typeof (pt as any).y !== 'number') {
          issues.push({
            severity: 'error',
            path: `${path}.data[${j}]`,
            message: 'Scatter points must be { x: number, y: number }.',
          });
        }
      });
    } else if (meta.type === 'bubble') {
      d.data.forEach((pt, j) => {
        const p = pt as any;
        if (!p || typeof p !== 'object' || typeof p.x !== 'number' || typeof p.y !== 'number' || typeof p.r !== 'number') {
          issues.push({
            severity: 'error',
            path: `${path}.data[${j}]`,
            message: 'Bubble points must be { x: number, y: number, r: number }.',
          });
        }
      });
    } else {
      // numeric arrays
      d.data.forEach((v, j) => {
        if (v !== null && typeof v !== 'number') {
          issues.push({
            severity: 'warning',
            path: `${path}.data[${j}]`,
            message: `Expected number (or null) for "${meta.type}" data; got ${typeof v}.`,
          });
        }
      });
      // labels-vs-data length check
      if (Array.isArray(data.labels) && d.data.length !== (data.labels as unknown[]).length) {
        issues.push({
          severity: 'warning',
          path: `${path}.data`,
          message: `Dataset length (${d.data.length}) does not match data.labels length (${(data.labels as unknown[]).length}).`,
        });
      }
    }
  });

  return issues;
}
