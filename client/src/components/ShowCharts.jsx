import React from 'react'
import { useState , useEffect } from 'react';
import { useRef } from 'react'
import {createChart , LineSeries} from 'lightweight-charts';
import useStock from '../context/stockContext';

const ShowCharts = ({symbol}) => {
    const chartRef = useRef(null);
    const chartContainerRef = useRef(null);
    const seriesRef = useRef(null);

    const {showChart} = useStock();

    const [range,setRange] = useState("1M");
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if (!chartContainerRef.current) return;

        chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#333"
      },
      grid: {
        vertLines: { color: "#eee" },
        horzLines: { color: "#eee" }
      },
      rightPriceScale: {
            scaleMargins: {
                top: 0.1,
                bottom: 0.1,
            },
        },

        timeScale: {
            timeVisible: true,
            secondsVisible: false,
        },

        handleScroll: {
            mouseWheel: true,
            pressedMouseMove: true,
        },

        handleScale: {
            axisPressedMouseMove: true,
            mouseWheel: true,
            pinch: true,
        },

        crosshair: {
            mode: 1,
        },
    });

    seriesRef.current = chartRef.current.addSeries(LineSeries);

    // Cleanup
    return () => {
      chartRef.current.remove();
    }
},[]);

    useEffect(() => {
    if (!symbol) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const data = await showChart(symbol, range);

        console.log("RAW DATA:", data); 

        if (seriesRef.current && Array.isArray(data)) {
        const cleanData = data.filter(
            d => d && d.time && d.value != null && !isNaN(d.value)
        );

        console.log("CLEAN DATA:", cleanData); 

        seriesRef.current.setData(cleanData);
        }

      } catch (error) {
        console.error("Chart data error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [symbol, range]);


  return (
    <div style={{marginTop : "20px"}}>
        <h3>{symbol.toUpperCase()} Chart</h3>

        <div style={{marginBottom : "10px"}}>
            {
                ["1D","1W","1M","3M","6M","1Y"].map(r=>(
                    <button key={r} onClick={()=> setRange(r)} style={{
                        marginRight : "5px",
                        padding : "6px 12px",
                        borderRadius : "4px",
                        border : "none",
                        cursor : "pointer",
                        background : range === r ? "#333" : "#ddd",
                        color : range === r ? "#fff" : "#000",
                    }}>
                        {r}
                    </button>
                ))
            }

        </div>

            {loading && <p>Loading Chart ...</p>}

            <div ref={chartContainerRef}
                style={{width : "100%" , height : " 400px "}} />
            
    </div>
  )
}

export default ShowCharts