// import React from 'react'
// import { useState , useEffect } from 'react';
// import { useRef } from 'react'
// import {createChart , LineSeries, CandlestickSeries, BarSeries, HistogramSeries} from 'lightweight-charts';
// import useStock from '../context/stockContext';
// // Recently commented
// // const ShowCharts = ({symbol}) => {
// //     const chartRef = useRef(null);
// //     const chartContainerRef = useRef(null);
// //     const seriesRef = useRef(null);

// //     const {showChart, chartType , setChartType} = useStock();

// //     const [range,setRange] = useState("1M");
// //     const [loading,setLoading] = useState(false);

// //     useEffect(()=>{
// //         if (!chartContainerRef.current) return;

// //         chartRef.current = createChart(chartContainerRef.current, {
// //       width: chartContainerRef.current.clientWidth,
// //       height: 400,
// //       layout: {
// //         background: { color: "#ffffff" },
// //         textColor: "#333"
// //       },
// //       grid: {
// //         vertLines: { color: "#eee" },
// //         horzLines: { color: "#eee" }
// //       },
// //       rightPriceScale: {
// //             scaleMargins: {
// //                 top: 0.1,
// //                 bottom: 0.1,
// //             },
// //         },

// //         timeScale: {
// //             timeVisible: true,
// //             secondsVisible: false,
// //         },

// //         handleScroll: {
// //             mouseWheel: true,
// //             pressedMouseMove: true,
// //         },

// //         handleScale: {
// //             axisPressedMouseMove: true,
// //             mouseWheel: true,
// //             pinch: true,
// //         },

// //         crosshair: {
// //             mode: 1,
// //         },
// //     });

// //     // seriesRef.current = chartRef.current.addSeries(LineSeries);
// //     if(chartType === "linechart"){
// //         seriesRef.current = chartRef.current.addSeries(LineSeries);
// //     }
// //     else if(chartType === "barchart"){
// //         seriesRef.current = chartRef.current.addSeries(BarSeries);
// //     }
// //     else if(chartType === "histogramchart"){
// //         seriesRef.current = chartRef.current.addSeries(HistogramSeries);
// //     }
// //     else if(chartType === "candlestickchart"){
// //         seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
// //     }

// //     // Cleanup
// //     return () => {
// //       chartRef.current?.remove();
// //     }
// // },[chartType]);
// // Recently commented
// // useEffect(() => {
// //         if (!chartContainerRef.current) return;

// //         chartRef.current = createChart(chartContainerRef.current, {
// //             width: chartContainerRef.current.clientWidth,
// //             height: 400,
// //             layout: {
// //                 background: { color: "#fff" },
// //                 textColor: "#333"
// //             },
// //         });

// //         // default series
// //         seriesRef.current = chartRef.current.addSeries(LineSeries);

// //         return () => {
// //             chartRef.current?.remove();
// //         };
// //     }, []);

// //     // ✅ CHANGE SERIES TYPE ONLY (DON’T RECREATE CHART)
// //     useEffect(() => {
// //         if (!chartRef.current) return;

// //         // remove old series
// //         if (seriesRef.current) {
// //             chartRef.current.removeSeries(seriesRef.current);
// //         }

// //         switch (chartType) {
// //             case "barchart":
// //                 seriesRef.current = chartRef.current.addSeries(BarSeries);
// //                 break;
// //             case "histogramchart":
// //                 seriesRef.current = chartRef.current.addSeries(HistogramSeries);
// //                 break;
// //             case "candlestickchart":
// //                 seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
// //                 break;
// //             default:
// //                 seriesRef.current = chartRef.current.addSeries(LineSeries);
// //         }

// //     }, [chartType]);

// //     // ✅ LOAD DATA SAFELY
// //     useEffect(() => {
// //         if (!symbol || !seriesRef.current) return;

// //         let active = true; // 🔥 prevents disposed error

// //         const loadData = async () => {
// //             try {
// //                 setLoading(true);

// //                 const data = await showChart(symbol, range, chartType);

// //                 if (!active) return;

// //                 let cleanData;

// //                 if (chartType === "linechart" || chartType === "histogramchart") {
// //                     cleanData = data.map(d => ({
// //                         time: d.time,
// //                         value: d.value ?? d.close
// //                     }));
// //                 } else {
// //                     cleanData = data.map(d => ({
// //                         time: d.time,
// //                         open: d.open,
// //                         high: d.high,
// //                         low: d.low,
// //                         close: d.close,
// //                     }));
// //                 }

// //                 seriesRef.current.setData(cleanData);
// //                 chartRef.current.timeScale().fitContent();

// //             } catch (err) {
// //                 console.error("Chart error:", err);
// //             } finally {
// //                 if (active) setLoading(false);
// //             }
// //         };

// //         loadData();

// //         return () => {
// //             active = false; // 🔥 KEY FIX
// //         };

// //     }, [symbol, range, chartType]);

// // useEffect(() => {
// //     if (!chartContainerRef.current || !symbol) return;

// //     let isMounted = true;

// //     const initChart = async () => {
// //         try {
// //             setLoading(true);

// //             // 🔥 remove old chart
// //             if (chartRef.current) {
// //                 chartRef.current.remove();
// //             }

// //             // 🔥 create chart
// //             chartRef.current = createChart(chartContainerRef.current, {
// //                 width: chartContainerRef.current.clientWidth,
// //                 height: 400,
// //                 layout: {
// //                     background: { color: "#ffffff" },
// //                     textColor: "#333"
// //                 },
// //                 grid: {
// //                     vertLines: { color: "#eee" },
// //                     horzLines: { color: "#eee" }
// //                 },
// //                 rightPriceScale: {
// //                     scaleMargins: {
// //                         top: 0.1,
// //                         bottom: 0.1,
// //                     },
// //                 },
// //                 timeScale: {
// //                     timeVisible: true,
// //                     secondsVisible: false,
// //                 },
// //             });

// //             // 🔥 create series
// //             switch (chartType) {
// //                 case "barchart":
// //                     seriesRef.current = chartRef.current.addSeries(BarSeries);
// //                     break;
// //                 case "histogramchart":
// //                     seriesRef.current = chartRef.current.addSeries(HistogramSeries);
// //                     break;
// //                 case "candlestickchart":
// //                     seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
// //                     break;
// //                 default:
// //                     seriesRef.current = chartRef.current.addSeries(LineSeries);
// //             }

// //             // 🔥 fetch data AFTER series is ready
// //             const data = await showChart(symbol, range, chartType);

// //             if(!isMounted) return ;

// //             let cleanData;

// //             if (chartType === "linechart" || chartType === "histogramchart") {
// //                 cleanData = data.map(d => ({
// //                     time: d.time,
// //                     value: d.value ?? d.close
// //                 }));
// //             } else {
// //                 cleanData = data.map(d => ({
// //                     time: d.time,
// //                     open: d.open,
// //                     high: d.high,
// //                     low: d.low,
// //                     close: d.close,
// //                 }));
// //             }

// //             // 🔥 set data safely
// //             seriesRef.current.setData(cleanData);
// //             chartRef.current.timeScale().fitContent();

// //         } catch (err) {
// //             console.error("Chart error:", err);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     initChart();

// //     return () => {
// //         isMounted = false;
// //         chartRef.current?.remove();
// //     };

// // }, [symbol, range, chartType]);

// //     useEffect(() => {
// //     if (!symbol) return;

// //     const loadData = async () => {
// //       try {
// //         setLoading(true);

// //         const data = await showChart(symbol, range,chartType);

// //         console.log("RAW DATA:", data); 
// //         let cleanData;
// //         if (seriesRef.current && Array.isArray(data)) {
// //         // const cleanData = data.filter(
// //         //     d => d && d.time && d.value != null && !isNaN(d.value)
// //         // );

// //         if(chartType === "linechart" || chartType === "histogramchart"){
// //             cleanData = data.map(d=>({
// //                 time: d.time,
// //                 value : d.value ?? d.close
// //             }));
// //         }
// //         else{
// //             cleanData = data.map(d=>({
// //                 time : d.time,
// //                 open: d.open , 
// //                 high : d.high,
// //                 close: d.close,
// //                 low : d.low,
// //             }))
// //         }
        
// //         console.log("CLEAN DATA:", cleanData); 

// //         seriesRef.current.setData([]);

// //         seriesRef.current.setData(cleanData);
// //         }

// //       } catch (error) {
// //         console.error("Chart data error:", error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadData();
// //   }, [symbol, range,chartType]);

// // useEffect(() => {
// //     if (!chartContainerRef.current || !symbol) return;

// //     let isMounted = true; // 🔥 add this

// //     const initChart = async () => {
// //         try {
// //             setLoading(true);

// //             if (chartRef.current) {
// //                 chartRef.current.remove();
// //             }

// //             chartRef.current = createChart(chartContainerRef.current, {
// //                 width: chartContainerRef.current.clientWidth,
// //                 height: 400,
// //             });

// //             // create series
// //             switch (chartType) {
// //                 case "barchart":
// //                     seriesRef.current = chartRef.current.addSeries(BarSeries);
// //                     break;
// //                 case "histogramchart":
// //                     seriesRef.current = chartRef.current.addSeries(HistogramSeries);
// //                     break;
// //                 case "candlestickchart":
// //                     seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
// //                     break;
// //                 default:
// //                     seriesRef.current = chartRef.current.addSeries(LineSeries);
// //             }

// //             const data = await showChart(symbol, range, chartType);

// //             // 🔥 STOP if component updated/unmounted
// //             if (!isMounted) return;

// //             let cleanData;

// //             if (chartType === "linechart" || chartType === "histogramchart") {
// //                 cleanData = data.map(d => ({
// //                     time: d.time,
// //                     value: d.value ?? d.close
// //                 }));
// //             } else {
// //                 cleanData = data.map(d => ({
// //                     time: d.time,
// //                     open: d.open,
// //                     high: d.high,
// //                     low: d.low,
// //                     close: d.close,
// //                 }));
// //             }

// //             seriesRef.current.setData(cleanData);

// //         } catch (err) {
// //             console.error("Chart error:", err);
// //         } finally {
// //             if (isMounted) setLoading(false);
// //         }
// //     };

// //     initChart();

// //     return () => {
// //         isMounted = false; // 🔥 THIS IS THE FIX
// //         chartRef.current?.remove();
// //     };

// // }, [symbol, range, chartType]);
// // recently commented
// //   return (
// //     <div style={{marginTop : "20px"}}>
// //         <h3>{symbol.toUpperCase()} Chart</h3>

// //         <div style={{marginBottom : "10px"}}>
// //             {
// //                 ["1D","1W","1M","3M","6M","1Y"].map(r=>(
// //                     <button key={r} onClick={()=> setRange(r)} style={{
// //                         marginRight : "5px",
// //                         padding : "6px 12px",
// //                         borderRadius : "4px",
// //                         border : "none",
// //                         cursor : "pointer",
// //                         background : range === r ? "#333" : "#ddd",
// //                         color : range === r ? "#fff" : "#000",
// //                     }}>
// //                         {r}
// //                     </button>
// //                 ))

// //             }
// //         </div>

// //         <div>Type of Charts  
// //             <button onClick={()=>setChartType("barchart")}>Bar</button>
// //             <button onClick={()=>setChartType("linechart")}>Line </button>
// //             <button onClick={()=>setChartType("histogramchart")}>Histogram</button>
// //             <button onClick={()=>setChartType("candlestickchart")}>Candlestick</button>
// //         </div>

// //             {loading && <p>Loading Chart ...</p>}

// //             <div ref={chartContainerRef}
// //                 style={{width : "100%" , height : " 400px "}} />
            
// //     </div>
// //   )
// // }



// // Updated Code :
// const ShowCharts = ({ symbol }) => {
//   const chartRef = useRef(null);
//   const seriesRef = useRef(null);
//   const chartContainerRef = useRef(null);

//   const { showChart } = useStock();

//   const [range, setRange] = useState("1M");
//   const [chartType, setChartType] = useState("linechart");
//   const [loading, setLoading] = useState(false);

//   // ✅ Create chart ONCE
//   useEffect(() => {
//     if (!chartContainerRef.current) return;

//     chartRef.current = createChart(chartContainerRef.current, {
//       width: chartContainerRef.current.clientWidth,
//       height: 400,
//     });

//     seriesRef.current = chartRef.current.addSeries(LineSeries);

//     return () => {
//       chartRef.current?.remove();
//     };
//   }, []);

//   // ✅ Change chart type ONLY
//   useEffect(() => {
//     if (!chartRef.current) return;

//     chartRef.current.removeSeries(seriesRef.current);

//     switch (chartType) {
//       case "barchart":
//         seriesRef.current = chartRef.current.addSeries(BarSeries);
//         break;
//       case "histogramchart":
//         seriesRef.current = chartRef.current.addSeries(HistogramSeries);
//         break;
//       case "candlestickchart":
//         seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
//         break;
//       default:
//         seriesRef.current = chartRef.current.addSeries(LineSeries);
//     }
//   }, [chartType]);

//   // ✅ Load data
//   useEffect(() => {
//     if (!symbol) return;

//     let active = true;

//     const loadData = async () => {
//       try {
//         setLoading(true);

//         const data = await showChart(symbol, range);

//         if (!active) return;

//         let cleanData;

//         // 📊 Line / Histogram
//         if (chartType === "linechart" || chartType === "histogramchart") {
//           cleanData = data.map(d => ({
//             time: d.time,
//             value: d.close
//           }));
//         }
//         // 📊 Bar / Candle
//         else {
//           cleanData = data;
//         }

//         seriesRef.current.setData(cleanData);
//         chartRef.current.timeScale().fitContent();

//       } catch (err) {
//         console.error("Chart error:", err);
//       } finally {
//         if (active) setLoading(false);
//       }
//     };

//     loadData();

//     return () => {
//       active = false;
//     };

//   }, [symbol, range, chartType]);

//   return (
//     <div style={{ marginTop: "20px" }}>
//       <h3>{symbol.toUpperCase()} Chart</h3>

//       {/* Range */}
//       <div>
//         {["1D","1W","1M","3M","6M","1Y"].map(r => (
//           <button key={r} onClick={() => setRange(r)}>
//             {r}
//           </button>
//         ))}
//       </div>

//       {/* Chart Type */}
//       <div>
//         <button onClick={() => setChartType("linechart")}>Line</button>
//         <button onClick={() => setChartType("barchart")}>Bar</button>
//         <button onClick={() => setChartType("histogramchart")}>Histogram</button>
//         <button onClick={() => setChartType("candlestickchart")}>Candle</button>
//       </div>

//       {loading && <p>Loading...</p>}

//       <div ref={chartContainerRef} style={{ width: "100%", height: "400px" }} />
//     </div>
//   );
// };

// export default ShowCharts

import React, { useState , useEffect , useRef } from 'react'
import {createChart , LineSeries, CandlestickSeries, BarSeries, HistogramSeries} from 'lightweight-charts';
import useStock from '../context/stockContext';

const ShowCharts = ({ symbol }) => {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const chartContainerRef = useRef(null);

  const { showChart } = useStock();

  const [range, setRange] = useState("1M");
  const [chartType, setChartType] = useState("linechart");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    seriesRef.current = chartRef.current.addSeries(LineSeries);

    return () => {
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;

    chartRef.current.removeSeries(seriesRef.current);

    switch (chartType) {
      case "barchart":
        seriesRef.current = chartRef.current.addSeries(BarSeries);
        break;
      case "histogramchart":
        seriesRef.current = chartRef.current.addSeries(HistogramSeries);
        break;
      case "candlestickchart":
        seriesRef.current = chartRef.current.addSeries(CandlestickSeries);
        break;
      default:
        seriesRef.current = chartRef.current.addSeries(LineSeries);
    }
  }, [chartType]);

  useEffect(() => {
    if (!symbol) return;

    let active = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const data = await showChart(symbol, range);

        if (!active) return;

        let cleanData;

        if (chartType === "linechart" || chartType === "histogramchart") {
          cleanData = data.map(d => ({
            time: d.time,
            value: d.close
          }));
        } else {
          cleanData = data;
        }

        seriesRef.current.setData(cleanData);
        chartRef.current.timeScale().fitContent();

      } catch (err) {
        console.error("Chart error:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };

  }, [symbol, range, chartType]);

  return (
    <div style={{
      marginTop: "20px",
      background: "#fff",
      padding: "15px",
      borderRadius: "10px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{marginBottom: "10px"}}>{symbol.toUpperCase()} Chart</h3>

      {/* Range */}
      <div style={{marginBottom: "10px"}}>
        {["1D","1W","1M","3M","6M","1Y"].map(r => (
          <button 
            key={r} 
            onClick={() => setRange(r)}
            style={{
              marginRight: "5px",
              padding: "6px 10px",
              borderRadius: "6px",
              border: "none",
              background: range === r ? "#333" : "#ddd",
              color: range === r ? "#fff" : "#000",
              cursor: "pointer"
            }}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Chart Type */}
      <div style={{marginBottom: "10px"}}>
        <button onClick={() => setChartType("linechart")}>Line</button>
        <button onClick={() => setChartType("barchart")}>Bar</button>
        <button onClick={() => setChartType("histogramchart")}>Histogram</button>
        <button onClick={() => setChartType("candlestickchart")}>Candle</button>
      </div>

      {loading && <p>Loading...</p>}

      <div 
        ref={chartContainerRef} 
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "8px",
          overflow: "hidden"
        }} 
      />
    </div>
  );
};

export default ShowCharts;