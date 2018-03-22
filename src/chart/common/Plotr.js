import withResponsive from './hocWithResponsive';

import PiePlot from '../Pie/PiePlot';
import LinePlot from '../Line/LinePlot';
import BarPlot from '../Bar/BarPlot';
import ScatterPlot from '../Scatter/ScatterPlot';
import AreaPlot from '../Area/AreaPlot';

/**
 * 所有图表对应的 响应式类型
 */
const PiePlotr = withResponsive(PiePlot);
const LinePlotr = withResponsive(LinePlot);
const BarPlotr = withResponsive(BarPlot);
const ScatterPlotr = withResponsive(ScatterPlot);
const AreaPlotr = withResponsive(AreaPlot);

export {
  PiePlotr,
  LinePlotr,
  BarPlotr,
  ScatterPlotr,
  AreaPlotr,
};
