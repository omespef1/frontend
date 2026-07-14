import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { ChartBlock } from '../../../../../core/models/rich-content.model';

@Component({
  selector: 'app-chart-block',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  template: `
    <div class="chart-container">
      <div class="chart-header" *ngIf="block.title">
        <h4>{{ block.title }}</h4>
      </div>
      <div echarts [options]="chartOption" class="echarts-wrapper"></div>
    </div>
  `,
  styles: [`
    .chart-container {
      background: var(--white, #fff);
      border: 1px solid var(--gray-200, #E5E5E5);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
    }
    .chart-header h4 {
      margin: 0 0 1rem 0;
      color: var(--gray-900, #1A1A1A);
      font-size: 1rem;
    }
    .echarts-wrapper {
      height: 300px;
      width: 100%;
    }
  `]
})
export class ChartBlockComponent implements OnChanges {
  @Input() block!: ChartBlock;
  chartOption: EChartsOption = {};

  ngOnChanges() {
    this.initChart();
  }

  private initChart() {
    if (!this.block || !this.block.data) return;

    const data = this.block.data;
    
    // Default colors if not provided
    const defaultColors = ['#E4002B', '#1A1A1A', '#A3A3A3', '#E5E5E5'];
    
    const series = data.datasets.map((ds: any, idx: number) => ({
      name: ds.label,
      type: this.block.chartType === 'doughnut' ? 'pie' : this.block.chartType,
      data: ds.values,
      itemStyle: { color: ds.color || defaultColors[idx % defaultColors.length] },
      smooth: this.block.chartType === 'area' ? true : false,
      areaStyle: this.block.chartType === 'area' ? {} : undefined,
      radius: this.block.chartType === 'doughnut' ? ['40%', '70%'] : undefined
    }));

    this.chartOption = {
      tooltip: {
        trigger: this.block.chartType === 'pie' || this.block.chartType === 'doughnut' ? 'item' : 'axis'
      },
      legend: {
        bottom: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: this.block.chartType === 'pie' || this.block.chartType === 'doughnut' ? undefined : {
        type: 'category',
        data: data.labels
      },
      yAxis: this.block.chartType === 'pie' || this.block.chartType === 'doughnut' ? undefined : {
        type: 'value'
      },
      series: series as any
    };
  }
}
