import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  Label,
} from "recharts";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Types
interface ChartData {
  name: string;
  "Traditional Methods (%)": number;
  "Our Solution (%)": number;
}

const data: ChartData[] = [
  {
    name: "OCR Accuracy",
    "Traditional Methods (%)": 65,
    "Our Solution (%)": 98,
  },
  {
    name: "AI Detection Rate",
    "Traditional Methods (%)": 45,
    "Our Solution (%)": 95,
  },
  {
    name: "Blockchain Security",
    "Traditional Methods (%)": 20,
    "Our Solution (%)": 99,
  },
  {
    name: "Processing Speed",
    "Traditional Methods (%)": 30,
    "Our Solution (%)": 95,
  },
  {
    name: "Cost Efficiency",
    "Traditional Methods (%)": 40,
    "Our Solution (%)": 90,
  },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
  active,
  //@ts-ignore
  payload,
  //@ts-ignore
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg bg-black/80 px-3 py-2 text-white shadow">
      <p className="mb-1 text-sm font-semibold">{label}</p>
      {payload.map((entry: any, index: any) => (
        <p key={index} className="text-xs" style={{ color: entry.color }}>
          {entry.dataKey}: {entry.value}%
        </p>
      ))}
    </div>
  );
};

const TechStackChart: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Card
      ref={chartRef}
      className="w-full col-span-1 md:col-span-2 lg:col-span-4 border-0 bg-white/5 backdrop-blur-md"
    >
      <CardContent className="h-[360px] md:h-[420px] lg:h-[520px]">
        <ResponsiveContainer width="100%" height="110%">
          <BarChart
            data={data}
            margin={{ top: 40, right: 24, left: 8, bottom: 48 }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#9CA3AF", fontSize: 12, textAnchor: "end" }}
              angle={-15}
              height={60}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            ></XAxis>
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              axisLine={{ stroke: "#374151" }}
              tickLine={{ stroke: "#374151" }}
            >
              <Label
                value="Performance Percentage (%)"
                angle={-90}
                position="insideLeft"
                offset={20}
                fill="#9CA3AF"
              />
            </YAxis>
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Legend wrapperStyle={{ color: "#D1D5DB" }} iconType="circle" />
            <Bar
              dataKey="Traditional Methods (%)"
              fill="url(#redGradient)"
              radius={[6, 6, 0, 0]}
              animationBegin={isVisible ? 0 : 9999}
              animationDuration={1000}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="Our Solution (%)"
              fill="url(#greenGradient)"
              radius={[6, 6, 0, 0]}
              animationBegin={isVisible ? 200 : 9999}
              animationDuration={1000}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full rounded-md border border-white/10 bg-white/5 p-3 text-center text-sm text-gray-400">
          Based on industry benchmarks for OCR, AI/ML, and blockchain
          technologies
        </div>
      </CardFooter>
    </Card>
  );
};

export default TechStackChart;
