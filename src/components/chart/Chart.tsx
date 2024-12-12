import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useMainStore from "@/hooks/use-main-store";
import CinamaticButton from "../CinamaticButton";

const chartConfig = {
  ticketPoolCapacity: {
    label: "Ticket Pool Capacity /s",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function TimeRangeChart() {
  const { filteredData, wsService } = useMainStore();

  const latestReponse = filteredData[filteredData.length - 1];

  const stopUserSimulation = () => {
    wsService.sendMessage(
      `${latestReponse?.activeStatus ? "stopSimulation:" : "startSimulation:"}`
    );
  };

  return (
    <Card className="bg-black text-white border-none shadow-md rounded-lg w-full h-full">
      {/* Card Header */}
      <CardHeader className="flex items-center gap-4 space-y-0 border-b border-gray-700 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-lg font-semibold">
            Ticket Pool Status With Time
          </CardTitle>
          <CardDescription className="text-sm text-gray-400">
            Showing total Ticket pool status with time while buying and selling
            tickets.
          </CardDescription>
        </div>

        <div className="p-[3px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          <div className="px-8 py-6 bg-black rounded-[6px]    relative group transition duration-200 text-white">
            <h3>Total Pool Ticket Count Now:</h3>
            <h2>Ticket: {latestReponse?.["ticketPoolCapacity"]}</h2>
          </div>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="px-4 pt-6 sm:px-6 sm:pt-8">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            {/* Gradients for Area Fill */}
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ticketPoolCapacity)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ticketPoolCapacity)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            {/* Chart Axes */}
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#444"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "#aaa", fontSize: "12px" }}
              tickFormatter={(value) => {
                const seconds = Math.floor(value / 10000); // Assuming `value` is in milliseconds
                return `${seconds}s`;
              }}
            />

            <YAxis
              dataKey="ticketPoolCapacity"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "#aaa", fontSize: "12px" }}
              tickFormatter={(value) => {
                return value;
              }}
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={{ stroke: "#555", strokeWidth: 1 }}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const seconds = Math.floor(value / 10000); // Assuming `value` is in milliseconds
                    return `${seconds}s`;
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="ticketPoolCapacity"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="var(--color-ticketPoolCapacity)"
              strokeWidth={2}
              stackId="a"
            />

            {/* Legend */}
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{ color: "#ccc", fontSize: "12px" }}
            />
          </AreaChart>
        </ChartContainer>

        <div className="flex gap-5 items-stretch px-5">
          <div className="p-[3px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
            <div className="px-8 py-6 bg-black rounded-[6px]    relative group transition duration-200 text-white">
              <h3>Remainig Total Ticket Count</h3>
              <h1>Ticket: {latestReponse?.["pendingTotalTickets"]}</h1>
            </div>
          </div>
          <CinamaticButton
            onClick={stopUserSimulation}
            activeStatus={latestReponse?.activeStatus}
          >
            {latestReponse?.activeStatus ? "Stop" : "Start"}
          </CinamaticButton>
        </div>
      </CardContent>
    </Card>
  );
}
