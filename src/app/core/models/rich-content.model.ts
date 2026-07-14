export type RichContentBlock = ChartBlock | KpiBlock | DataTableBlock;

export interface ChartBlock {
  type: 'chart';
  chartType: 'bar' | 'line' | 'pie' | 'doughnut' | 'area';
  title: string;
  data: ChartDataset;
  options?: Record<string, any>;
}

export interface ChartDataset {
  labels: string[];
  datasets: {
    label: string;
    values: number[];
    color?: string;
  }[];
}

export interface KpiBlock {
  type: 'kpi';
  title: string;
  metrics: KpiMetric[];
}

export interface KpiMetric {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: string;
}

export interface DataTableBlock {
  type: 'data_table';
  title: string;
  headers: string[];
  rows: (string | number)[][];
  footer?: string;
}
