// Tree-shaken ECharts (replaces `import * as echarts from "echarts"`, which ships every chart type).
import * as echarts from "echarts/core";
import { BarChart, LineChart, PieChart, RadarChart, ScatterChart, SankeyChart, TreemapChart, HeatmapChart } from "echarts/charts";
import { GridComponent, TooltipComponent, LegendComponent, TitleComponent, DatasetComponent, VisualMapComponent, AriaComponent } from "echarts/components";
import { LabelLayout, UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  BarChart, LineChart, PieChart, RadarChart, ScatterChart, SankeyChart, TreemapChart, HeatmapChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, DatasetComponent, VisualMapComponent, AriaComponent,
  LabelLayout, UniversalTransition, CanvasRenderer,
]);

export const DRISHTI_PALETTE = ["#2078cf", "#0e4eb2", "#011f65", "#020c47", "#000521", "#8bb5e7", "#b9cde7", "#d9e9fa"];

echarts.registerTheme("drishti", {
  color: DRISHTI_PALETTE,
  backgroundColor: "transparent",
  textStyle: { fontFamily: "var(--font-ui-next), 'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", color: "#243c65" },
  animationDuration: 900,
  animationEasing: "cubicOut",
  animationDurationUpdate: 500,
  animationEasingUpdate: "cubicInOut",
  categoryAxis: { axisLine: { lineStyle: { color: "#c3d0e0" } }, axisTick: { show: false }, axisLabel: { color: "#536782" }, splitLine: { show: false } },
  valueAxis: { axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: "#536782" }, splitLine: { lineStyle: { color: "#e7edf5" } } },
  tooltip: { backgroundColor: "#000521", borderWidth: 0, padding: [8, 12], textStyle: { color: "#fff" }, extraCssText: "border-radius:8px;box-shadow:0 12px 32px -10px rgba(0,5,33,.28)" },
  bar: { barMaxWidth: 28, itemStyle: { borderRadius: [6, 6, 0, 0] } },
});

export { echarts };
