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

export const DRISHTI_PALETTE = ["#2879b9", "#0f7e83", "#32764c", "#df9826", "#8063a5", "#a23e3c", "#5370a5", "#718d48"];

echarts.registerTheme("drishti", {
  color: DRISHTI_PALETTE,
  backgroundColor: "transparent",
  textStyle: { fontFamily: "var(--font-ui-next), 'Hind Vadodara', 'Noto Sans Gujarati', sans-serif", color: "#315164" },
  animationDuration: 900,
  animationEasing: "cubicOut",
  animationDurationUpdate: 500,
  animationEasingUpdate: "cubicInOut",
  categoryAxis: { axisLine: { lineStyle: { color: "#c8d7e3" } }, axisTick: { show: false }, axisLabel: { color: "#536c78" }, splitLine: { show: false } },
  valueAxis: { axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: "#536c78" }, splitLine: { lineStyle: { color: "#e1e9eb" } } },
  tooltip: { backgroundColor: "#123650", borderWidth: 0, padding: [8, 12], textStyle: { color: "#fff" }, extraCssText: "border-radius:8px;box-shadow:0 12px 32px -10px rgba(18,54,80,.22)" },
  bar: { barMaxWidth: 28, itemStyle: { borderRadius: [6, 6, 0, 0] } },
});

export { echarts };
