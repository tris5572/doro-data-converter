/**
 * 道路データの各線の情報を表す型
 */
export type LineData = {
  /**
   * 道路種別コード
   *
   * - 1: 高速道路
   * - 2: 一般道路
   * - 3: 主要地方道
   * - 4: 一般都道府県道
   * - 5: 特別「都道府県道」
   * - 6: 市町村道
   * - 7: 私道
   *
   * @see https://nlftp.mlit.go.jp/ksj/gmlold/codelist/RoadTypeCd.html
   */
  roadTypeCode: "1" | "2" | "3" | "4" | "5" | "6" | "7";
  /**
   * 路線名
   */
  routeName: string | null;
  /**
   * 線名
   */
  lineName: string | null;
  /**
   * 通称
   */
  popularName: string | null;
  /**
   * 線の座標データ
   */
  coordinates: [number, number][];
};
