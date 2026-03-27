import { readFileSync, writeFileSync } from "node:fs";
import { parseGeoJSON } from "./parse.ts";
import type { LineData } from "./types.ts";

const fileData = readFileSync("./sampleData/全国.json", "utf-8");
const data = parseGeoJSON(fileData);
const groupedData = groupByRoadTypeCode(data);

for (const key of Object.keys(groupedData)) {
  if (groupedData[key] != undefined) {
    const filePath = `./output/${key}.json`;
    saveAsGeoJSON(groupedData[key], filePath);
  }
}

/**
 * 道路データを、道路種別コードでグループ化する
 */
export function groupByRoadTypeCode(lineDataArray: LineData[]) {
  const groupedData: Record<string, LineData[]> = {};
  for (const lineData of lineDataArray) {
    const roadTypeCode = lineData.roadTypeCode ?? "unknown";
    if (!groupedData[roadTypeCode]) {
      groupedData[roadTypeCode] = [];
    }
    groupedData[roadTypeCode].push(lineData);
  }
  return groupedData;
}

/**
 * 道路データを GeoJSON ファイルとして保存する
 */
export function saveAsGeoJSON(lineDataArray: LineData[], filePath: string) {
  const geoJSONObject = {
    type: "FeatureCollection",
    features: lineDataArray.map((lineData) => ({
      type: "Feature",
      properties: {
        roadTypeCode: lineData.roadTypeCode,
        routeName: lineData.routeName,
        lineName: lineData.lineName,
        popularName: lineData.popularName,
      },
      geometry: {
        type: "LineString",
        coordinates: lineData.coordinates,
      },
    })),
  };
  const geoJSONString = JSON.stringify(geoJSONObject, null, 0);

  writeFileSync(filePath, geoJSONString, "utf-8");
}
