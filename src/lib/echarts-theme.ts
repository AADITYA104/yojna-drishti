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

export const DRISHTI_PALETTE = ["#1b2a5e", "#0f7c86", "#f2a413", "#4a5fa8", "#2e8b57", "#b3382c", "#7545a5", "#3aa7ae"];

echarts.registerTheme("drishti", {
  color: DRISHTI_PALETTE,
  backgroundColor: "transparent",
  textStyle: { fontFamily: "var(--font-ui-next), 'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", color: "#3b4466" },
  animationDuration: 900,
  animationEasing: "cubicOut",
  animationDurationUpdate: 500,
  animationEasingUpdate: "cubicInOut",
  categoryAxis: { axisLine: { lineStyle: { color: "#c9cdc4" } }, axisTick: { show: false }, axisLabel: { color: "#5e6785" }, splitLine: { show: false } },
  valueAxis: { axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: "#5e6785" }, splitLine: { lineStyle: { color: "#edefea" } } },
  tooltip: { backgroundColor: "#0d1530", borderWidth: 0, padding: [8, 12], textStyle: { color: "#fff" }, extraCssText: "border-radius:8px;box-shadow:0 12px 32px -10px rgba(13,21,48,.5)" },
  bar: { barMaxWidth: 28, itemStyle: { borderRadius: [6, 6, 0, 0] } },
});

export { echarts };
