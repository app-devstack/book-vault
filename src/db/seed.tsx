import { EMPTY_SERIES_ID, EMPTY_SHOP_ID } from "@/utils/constants";
import db from ".";
import { schema } from "./schema";

export async function initializeDatabaseSeed() {
  const existingSeries = await db.query.series.findFirst({
    where: (series, { eq }) => eq(series.id, EMPTY_SERIES_ID),
  });

  if (!existingSeries){
    await db.insert(schema.series).values(
      { id: EMPTY_SERIES_ID, title: "未分類" },
  )
}

  const existingShop = await db.query.shops.findFirst({
    where: (shops, { eq }) => eq(shops.id, EMPTY_SHOP_ID),
  });

  if (!existingShop) {
    await db.insert(schema.shops).values(
      { id: EMPTY_SHOP_ID, name: "未分類ショップ", displayName: "未分類ショップ" },
  )}
}