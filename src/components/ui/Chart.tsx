import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import "../../index.css";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sections: string[];
  data: number[];
}

const Chart: React.FC<Props> = ({ sections, data }) => {
  const [chartData, setChartData] = useState<any>(); // eslint-disable-line

  console.log(sections, data);

  useEffect(() => {
    setChartData({
      series: [
        {
          name: "Series 1",
          data: data,
        },
      ],
      options: {
        chart: {
          height: 350,
          type: "radar",
        },
        fill: {
          opacity: 0.2,
          colors: ["#F08110"],
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["#F08110"],
        },
        markers: {
          colors: ["#F08110"],
        },
        xaxis: {
          categories: sections,
          labels: {
            show: true,
            style: {
              colors: ["#3C3C3C"],
              fontSize: "12px",
            },
          },
        },
      },
    });
  }, [sections, data]);

  return (
    <div id="chart">
      {sections?.length > 0 && data?.length > 0 && (
        <ReactApexChart
          options={chartData?.options}
          series={chartData?.series}
          type="radar"
          height={400}
        />
      )}
    </div>
  );
};

export default Chart;
