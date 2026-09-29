export interface StatsSummaryDto {
  appointmentsToday: number;
  appointmentsThisMonth: number;
  activePatients: number;
  lowStockItems: number;
}

export interface StatsSeriesPoint {
  label: string;
  value: number;
}

export interface StatsChartsDto {
  appointmentsByMonth: StatsSeriesPoint[];
  appointmentsByStatus: StatsSeriesPoint[];
  topReasons: StatsSeriesPoint[];
}
