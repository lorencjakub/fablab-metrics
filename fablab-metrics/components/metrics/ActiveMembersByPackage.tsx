"use client";

import { BarTooltip, ResponsiveBar } from "@nivo/bar";
import { useTheme } from "@nivo/core";
import { Chip } from "@nivo/tooltip";
import { formatDate } from "date-fns";
import { useMetrics } from "fablab-metrics/components/useMetrics";
import { usePackages } from "fablab-metrics/components/usePackages";
import { useChartCommonProps } from "fablab-metrics/ui/useChartCommonProps";
import { useDateRange } from "fablab-metrics/ui/useDateRange";
import { sum } from "ramda";
import { PACKAGES_IDS } from "fablab-metrics/env";

var PACKAGES: string[] = [];

export function ActiveMembersByPackage() {
  const { zoom } = useDateRange();
  const metrics = useMetrics("active_members_by_package");
  const packages = usePackages();

  PACKAGES = packages.data?.filter((item: { id: number, name: string }) => PACKAGES_IDS.includes(item.id)).map((t: { id: number, name: string }) => t.name);
  console.debug(PACKAGES);
  const chartCommonProps = useChartCommonProps({
    leftAxisLegend: "Počet členů",
  });

  if (metrics.isLoading || packages.isLoading) return null;

  const data = metrics.data.map((m: any) => ({ ...m, Ostatní: sumOthers(m) }));
  console.debug(data);

  return (
    <div className="w-full h-96">
      {/* @ts-expect-error */}
      <ResponsiveBar
        {...chartCommonProps}
        data={data}
        keys={["Ostatní", ...PACKAGES]}
        indexBy="date"
        axisBottom={{
          format: (value) =>
            formatDate(value, zoom === "1m" ? "LLLL, yyyy" : "yyyy"),
          tickValues: zoom === "1m" ? "every month" : "every year",
        }}
        enableTotals
        tooltip={PackageTooltip}
      />
    </div>
  );
}

// const PACKAGES = ["Učedník", "Tovaryš", "Mistr", "Hobbylab crew"];

function sumOthers(metric: any) {
  return sum(
    Object.keys(metric)
      .filter((key) => key !== "date" && !PACKAGES.includes(key))
      .map((key) => metric[key]),
  );
}

function PackageTooltip({ id, label, value, ...props }: any) {
  const theme = useTheme();

  if (id !== "Ostatní") {
    return <BarTooltip id={id} label={label} value={value} {...props} />;
  }

  return (
    <div style={theme.tooltip.container}>
      <div style={theme.tooltip.basic}>
        <Chip color={props.color!} style={theme.tooltip.chip} />
        <span>
          {label}: <strong>{`${value}`}</strong>
        </span>
      </div>

      <div className="mt-4 flex flex-col">
        {Object.keys(props.data)
          .filter(
            (key) =>
              key !== "date" && key !== "Ostatní" && !PACKAGES.includes(key),
          )
          .sort()
          .map((key) => (
            <span key={key}>
              {key}: <strong>{props.data[key]}</strong>
            </span>
          ))}
      </div>
    </div>
  );
}
