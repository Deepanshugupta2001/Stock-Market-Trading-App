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
      layout: {
        background: { color: "#ffffff" },
        textColor: "#4b1f0e"
      },
      grid: {
        vertLines: { color: "#f4c28a" },
        horzLines: { color: "#f4c28a" }
      }
    });

    seriesRef.current = chartRef.current.addSeries(LineSeries);

    const resizeChart = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", resizeChart);

    return () => {
      window.removeEventListener("resize", resizeChart);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

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

        const cleanData = chartType === "linechart" || chartType === "histogramchart"
          ? data.map(d => ({ time: d.time, value: d.close }))
          : data;

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
    <div className="chart-card">
      <div className="chart-header">
        <h3>{symbol.toUpperCase()} Chart</h3>
        {loading && <span className="status-text">Loading...</span>}
      </div>

      <div className="control-row">
        {["1D","1W","1M","3M","6M","1Y"].map(r => (
          <button
            key={r}
            className={range === r ? "is-active" : ""}
            onClick={() => setRange(r)}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="control-row">
        <button className={chartType === "linechart" ? "is-active" : ""} onClick={() => setChartType("linechart")}>Line</button>
        <button className={chartType === "barchart" ? "is-active" : ""} onClick={() => setChartType("barchart")}>Bar</button>
        <button className={chartType === "histogramchart" ? "is-active" : ""} onClick={() => setChartType("histogramchart")}>Histogram</button>
        <button className={chartType === "candlestickchart" ? "is-active" : ""} onClick={() => setChartType("candlestickchart")}>Candle</button>
      </div>

      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default ShowCharts;
