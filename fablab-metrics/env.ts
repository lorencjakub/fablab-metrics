import path from "path";

export const DATA_PATH =
  process.env.DATA_PATH ?? path.join(process.cwd(), "data");

export const NEXT_PUBLIC_PACKAGES_IDS = process.env.NEXT_PUBLIC_PACKAGES_IDS?.split(",").map(i => parseInt(i)) ?? [];
