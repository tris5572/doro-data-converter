import type { LineData } from "./types.ts";

/**
 * 道路データの GeoJSON の文字列を、オブジェクトのデータへ変換する関数
 *
 * 入力値としては LineString のみを想定
 */
export function parseGeoJSON(geoJSONString: string): LineData[] {
  try {
    const geoJSONObject = JSON.parse(geoJSONString);
    if (geoJSONObject.type !== "FeatureCollection" || !Array.isArray(geoJSONObject.features)) {
      return [];
    }

    return geoJSONObject.features
      .map((feature: any) => {
        if (feature.type !== "Feature" || feature.geometry.type !== "LineString") {
          return null;
        }
        const properties = feature.properties || {};
        return {
          roadTypeCode: properties.N01_001 ?? null,
          routeName: properties.N01_002 ?? null,
          lineName: properties.N01_003 ?? null,
          popularName: properties.N01_004 ?? null,
          coordinates: feature.geometry.coordinates,
        };
      })
      .filter((item: LineData | null): item is LineData => item !== null);
  } catch (error) {
    console.error("Invalid GeoJSON string:", error);
    return [];
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest;

  describe("parseGeoJSON", () => {
    test("空文字列のとき、空の配列を返すこと", () => {
      expect(parseGeoJSON("")).toEqual([]);
    });

    test("空オブジェクトのとき、空の配列を返すこと", () => {
      expect(parseGeoJSON("{}")).toEqual([]);
    });

    test("1つのデータのとき、データを返すこと", () => {
      const DATA = `
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": { "N01_001": "3", "N01_002": "道路", "N01_003": null, "N01_004": null },
              "geometry": {
                "type": "LineString",
                "coordinates": [[1.1, 2.2], [3.3, 4.4], [5.5, 6.6]]
              }
            }
          ]
        }`;
      expect(parseGeoJSON(DATA)).toEqual([
        {
          roadTypeCode: "3",
          routeName: "道路",
          lineName: null,
          popularName: null,
          coordinates: [
            [1.1, 2.2],
            [3.3, 4.4],
            [5.5, 6.6],
          ],
        },
      ]);
    });

    test("複数のデータのとき、データを返すこと", () => {
      const DATA = `
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": { "N01_001": "3", "N01_002": "道路", "N01_003": null, "N01_004": null },
              "geometry": {
                "type": "LineString",
                "coordinates": [[1.1, 2.2], [3.3, 4.4], [5.5, 6.6]]
              }
            },
            {
              "type": "Feature",
              "properties": { "N01_001": "2", "N01_002": "道路2", "N01_003": "線の名前", "N01_004": "通称の名前" },
              "geometry": {
                "type": "LineString",
                "coordinates": [[2.2, 3.3], [4.4, 5.5], [6.6, 7.7]]
              }
            }
          ]
        }`;
      expect(parseGeoJSON(DATA)).toEqual([
        {
          roadTypeCode: "3",
          routeName: "道路",
          lineName: null,
          popularName: null,
          coordinates: [
            [1.1, 2.2],
            [3.3, 4.4],
            [5.5, 6.6],
          ],
        },
        {
          roadTypeCode: "2",
          routeName: "道路2",
          lineName: "線の名前",
          popularName: "通称の名前",
          coordinates: [
            [2.2, 3.3],
            [4.4, 5.5],
            [6.6, 7.7],
          ],
        },
      ]);
    });

    test("FeatureCollection ではないとき、空の配列を返すこと", () => {
      const DATA = `
        {
          "type": "ErrorData",
          "features": []
        }`;
      expect(parseGeoJSON(DATA)).toEqual([]);
    });

    test("properties が空のとき、名称のプロパティが null になること", () => {
      const DATA = `
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "LineString",
                "coordinates": [[1.1, 2.2], [3.3, 4.4]]
              }
            }
          ]
        }`;
      expect(parseGeoJSON(DATA)).toEqual([
        {
          roadTypeCode: null,
          routeName: null,
          lineName: null,
          popularName: null,
          coordinates: [
            [1.1, 2.2],
            [3.3, 4.4],
          ],
        },
      ]);
    });

    test("LineString ではないデータは無視されること", () => {
      const DATA = `
        {
          "type": "FeatureCollection",
          "features": [
            {
              "type": "Feature",
              "properties": { "N01_001": "3", "N01_002": "道路", "N01_003": null, "N01_004": null },
              "geometry": {
                "type": "Point",
                "coordinates": [1.1, 2.2]
              }
            }
          ]
        }`;
      expect(parseGeoJSON(DATA)).toEqual([]);
    });
  });
}
