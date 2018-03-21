# greact  
interactive chart components built with d3 & react.    
borrowed some code and ideas from [codesuki/react-d3-components](https://github.com/codesuki/react-d3-components) and [recharts/recharts](https://github.com/recharts/recharts).    

 :warning: greact is still under development, not stable enough to be used yet. 

## overview
greact is an **interactive** chart library built with [D3](http://d3js.org) and [React](https://facebook.github.io/react/).  
The main purpose of this library is to make developers and users happy when writing charts in React. Main principles of greact are:

- **Simple & Easy** to use with React components
- **Interactive** charting experience
- **Dynamic** data update support

## dev 
```sh
 git clone https://github.com/uptonking/greact.git
 cd greact/
 npm install
 npm run build
```

## demo
```sh
 npm run demo
```

start from [http://localhost:3000](http://localhost:3000)

## todo
#### 2018
- [ ] pie plot 添加响应式
- [ ] pie plot 中间默认显示最大扇形的信息
- [ ] pie plot 添加legend
- [ ] pie plot 饼状图data要取x、y， 需要添加原始数据k、v自动转换成x、y的函数
- [ ] bar plot 水平与竖直方向切换
- [ ] bar plot 水平堆叠
- [ ] bar plot 条形图负值文本需要避让
- [ ] area plot 通过tooltip添加crosshair，type包括x,y,cross,rect
- [ ] tooltip 位置微调
- [x] refactor: 用高阶组件代替 mixins
- [x] 使用静态属性替换defaultProps, propTypes

#### 201x
- [ ] 添加方法： 生成同一个颜色的不同等级
- [ ] demo主页加载太慢，要减小打包体积
- [ ] hover时变大或变长，鼠标移出还原
- [ ] 嵌套高阶组件改为 lodash flowRight()

#### remind
- [x] pie simple
- [x] line simple
- [x] bar simple
- [x] scatter simple
- [x] area simple
- [ ] bar horizontal 
- [ ] bar + line
- [ ] bar stack percent 
- [ ] bar waterfall 
- [ ] line smooth 
- [ ] gauge 
- [ ] funnel simple
- [ ] radar simple
- [ ] tree simple
- [ ] heatmap simple
- [ ] sankey simple
- [ ] boxplot simple

- [ ] big title 
- [ ] word cloud 
- [ ] table 

- [ ] map simple

- [ ] rfm

- [ ] migrate to d3 v5.x

## usage

#### PiePlot  
准备数据  
```js
    const data = {
      label: '事例一',
      values: [
        {x: '事例一', y: 40},
        {x: '事例二', y: 21},
      ]
    };
```
[使用组件示例](https://github.com/uptonking/greact/blob/master/demo/component/plot/PiePlotDemo.js)  
```js
 <PiePlot
          data={data}
          width={800}
          height={480}
          margin={{top: 10, bottom: 10, left: 100, right: 100}}
          tooltipMode={'fixed'}
          tooltipOffset={{top: 210, left: 280}}
          tooltipHtml={tooltipPie}
          sort={null}
        />
```

#### LinePlot  
[使用组件示例](https://github.com/uptonking/greact/blob/master/demo/component/plot/LinePlotDemo.js)   
```js
 <LinePlot
          data={data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipLine}
          tooltipContained
          xAxis={{innerTickSize: 6, label: "x-label"}}
          yAxis={{label: "y-label"}}
          shapeColor={"red"}
          stroke={{strokeDasharray: dashFunc, strokeWidth: widthFunc}}
        />
```  

#### BarPlot  
[使用组件示例](https://github.com/uptonking/greact/blob/master/demo/component/plot/BarPlotDemo.js)     
```js
  <BarPlot
          data={data1}
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          colorByLabel={false}
        />
```

#### ScatterPlot  
[使用组件示例](https://github.com/uptonking/greact/blob/master/demo/component/plot/ScatterPlotDemo.js)     
```js
  <ScatterPlot
           data={data}
           width={400}
           height={400}
           margin={{top: 10, bottom: 50, left: 50, right: 10}}
           tooltipHtml={tooltipScatter}
           xAxis={{innerTickSize: 6, label: "x-label"}}
           yAxis={{label: "y-label"}}
         />
```
#### AreaPlot  
[使用组件示例](https://github.com/uptonking/greact/blob/master/demo/component/plot/AreaPlotDemo.js)     
```js
   <AreaPlot
          data={data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipArea}
        />
```

## License

[MIT](http://opensource.org/licenses/MIT)




