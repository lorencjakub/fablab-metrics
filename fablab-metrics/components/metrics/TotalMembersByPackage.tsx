"use client";

import { ResponsiveLine } from "@nivo/line";
import { useMetrics } from "fablab-metrics/components/useMetrics";
import { usePackages } from "fablab-metrics/components/usePackages";
import { useChartCommonProps } from "fablab-metrics/ui/useChartCommonProps";
import { useDateRange } from "fablab-metrics/ui/useDateRange";
import { sum } from "ramda";
import { NEXT_PUBLIC_PACKAGES_IDS as PACKAGES_IDS } from "fablab-metrics/env";

var PACKAGES: string[] = [];

export function TotalMembersByPackage() {
  const { zoom } = useDateRange();
  const metrics = useMetrics("total_members_by_package");
  const packages = usePackages();

  const chartCommonProps = useChartCommonProps({
    leftAxisLegend: "Počet členů",
  });

  if (metrics.isLoading || packages.isLoading) return null;

  PACKAGES = packages.data?.filter((item: { id: number, name: string }) => PACKAGES_IDS.includes(item.id)).map((t: { id: number, name: string }) => {
    if (t.name.startsWith("Tovaryš")) return "Tovaryš"

    return t.name
  });

  let dataset: any[] = [];
  dataset.push({
    id: "Ostatní",
    data: metrics.data.map((metric: any) => ({
      x: metric.date,
      y: sumOthers(metric),
    })),
  });

  PACKAGES.forEach((id) => {
    dataset.push({
      id,
      data: metrics.data.map((metric: any) => ({
        x: metric.date,
        y: metric[id] ?? 0,
      })),
    });
  });

  dataset.push({
    id: "Celkem",
    data: metrics.data.map((metric: any) => ({
      x: metric.date,
      y: sum(PACKAGES.map((key) => metric[key] ?? 0)),
    })),
  });

  dataset.push({
    id: "Celkem + Ostatní",
    data: metrics.data.map((metric: any) => ({
      x: metric.date,
      y: sum(PACKAGES.map((key) => metric[key] ?? 0)) + sumOthers(metric),
    })),
  });

  return (
    <div className="w-full h-96">
      {/* @ts-expect-error */}
      <ResponsiveLine
        {...chartCommonProps}
        data={dataset}
        enablePoints
        enablePointLabel
        enableSlices="x"
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: zoom === "1m" ? "month" : "year",
        }}
      />
    </div>
  );
}

function sumOthers(metric: any) {
  return sum(
    Object.keys(metric)
      .filter((key) => key !== "date" && !PACKAGES.includes(key))
      .map((key) => metric[key]),
  );
}
