import db from "@/db";
import { book } from "@/db/schema";
import { Book } from "@/db/types";

const documents = [
  {
    id: "1",
    title: "文豪ストレイドッグス(26)",
    description: "Description 1",
    targetURL: "https://booklive.jp/product/index/title_id/206670/vol_no/026",
    imageURL: "https://res.booklive.jp/206670/026/thumbnail/2L.jpg",
    addedAt: new Date(),
  },
  {
    id: "2",
    title: "ワールドトリガー 28",
    description: "Description 2",
    targetURL: "https://booklive.jp/product/index/title_id/222604/vol_no/028",
    imageURL: "https://res.booklive.jp/222604/028/thumbnail/2L.jpg",
    addedAt: new Date(),
  },
  {
    id: "3",
    title: "本のタイトル",
    description: "ジャンプSQ. RISE 2023 SPRING",
    targetURL: "https://booklive.jp/product/index/title_id/514170/vol_no/021",
    imageURL: "https://res.booklive.jp/514170/021/thumbnail/2L.jpg",
    addedAt: new Date(),
  },
] satisfies Book[];

export const createDummyBook = async () => {
  // 本の削除
  await db.delete(book);

  // 本の登録
  await db.insert(book).values(documents);

  // 登録した本の検索
  const books = await db.query.book.findMany();
  console.log("books", books);

  return books;
};
