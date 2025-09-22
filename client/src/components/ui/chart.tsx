"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"


// Use ChartConfig and useChart directly in this file
export type ChartConfig = {
  [key: string]: {
    label?: string
    color?: string
    icon?: React.ComponentType<{ className?: string }>
  }
}

export function useChart({ config }: { config: ChartConfig }) {
  return React.useMemo(() => {
    return {
      chartConfig: config,
    }
  }, [config])
}

const ChartContext = React.createContext<ChartContextType | null>(null)

type ChartContextType = {
  chartConfig: ChartConfig
}

function useChartContext() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChartContext must be used within a ChartProvider")
  }

  return context
}

export function ChartContainer({
  className,
  config,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
}) {
  const chartContextValue = useChart({ config })
  const newChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        config: chartContextValue.chartConfig,
        ...child.props,
      })
    }
    return child
  })

  return (
    <ChartContext.Provider value={chartContextValue}>
      <div
        data-chart-container
        className={cn("h-[200px] w-full", className)}
        {...props}
      >
        {newChildren}
      </div>
    </ChartContext.Provider>
  )
}

export function ChartTooltip({
  className,
  content,
  ...props
}: React.ComponentProps<typeof Tooltip> & {
  content: React.ReactNode
}) {
  const context = useChartContext()

  return (
    <TooltipProvider>
      <Tooltip {...props}>
        <TooltipTrigger asChild>
          {React.cloneElement(content as React.ReactElement)}
        </TooltipTrigger>
        <TooltipContent
          sideOffset={8}
          className={cn(
            "bg-popover text-popover-foreground z-[100] max-w-[300px] rounded-md border p-4 shadow-md",
            className
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function ChartTooltipContent({
  className,
  nameKey,
  labelKey,
  payload,
  ...props
}: React.ComponentProps<"div"> & {
  nameKey?: string
  labelKey?: string
  payload?: { name: string; value: number; payload: any }[]
}) {
  const context = useChartContext()
  const hasPayload = payload && payload.length > 0
  const name = nameKey || "name"
  const label = labelKey || "label"

  if (!hasPayload) {
    return null
  }

  return (
    <div
      className={cn("grid min-w-[120px] items-start gap-1.5", className)}
      {...props}
    >
      {payload.map((item, index) => {
        const itemConfig = context.chartConfig[item.dataKey as keyof ChartConfig]

        return (
          <div
            key={item.dataKey || `tooltip-item-${index}`}
            className="flex items-center gap-2"
          >
            <div
              className="size-2 shrink-0 rounded-[2px]"
              style={{
                backgroundColor: `hsl(var(${itemConfig?.color}))`,
              }}
            />
            <div className="grid flex-1 text-xs">
              {itemConfig?.label && <div>{itemConfig.label}</div>}
              {item.value && (
                <div className="font-medium text-foreground">
                  {item.value}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}