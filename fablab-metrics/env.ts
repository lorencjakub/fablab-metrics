import path from "path";

export const DATA_PATH =
  process.env.DATA_PATH ?? path.join(process.cwd(), "data");

export const PACKAGES_IDS = process.env.PACKAGES_IDS?.split(",").map(i => parseInt(i)) ?? [];
