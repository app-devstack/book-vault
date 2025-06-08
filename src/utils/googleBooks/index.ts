import { BookSearchResult } from "@/types/book";
import { BookSearchItemType } from "@/utils/googleBooks/types";

/**
 * Google Books APIのレスポンスを内部形式に変換する関数
 * @param item - Google Books APIのbook item
 * @returns BookSearchResult - 内部形式の書籍データ
 */
export const transformBookSearchItem = (
  item: BookSearchItemType
): BookSearchResult => {
  const volumeInfo = item.volumeInfo || {};

  const {
    title,
    authors,
    publisher,
    description,
    industryIdentifiers = [],
    imageLinks,
    seriesInfo,
    canonicalVolumeLink,
  } = volumeInfo;

  // 巻数の取得と正規化
  const extractVolumeNumber = (): number | undefined => {
    const candidate =
      seriesInfo?.bookDisplayNumber || seriesInfo?.volumeSeries?.orderNumber;
    const parsed = Number(candidate);
    return isNaN(parsed) ? undefined : parsed;
  };
  // ISBNの取得
  const getIsbn = (): string | undefined => {
    return industryIdentifiers[0]?.identifier;
  };

  // 画像URLの取得
  const getImageUrl = (): string | undefined => {
    return imageLinks?.thumbnail || imageLinks?.smallThumbnail;
  };

  return {
    googleBooksId: item.id,
    title: title || "不明なタイトル",
    author: authors?.join(", ") || "不明な著者",
    volume: extractVolumeNumber(),
    publisher: publisher || "不明な出版社",
    description: description || "説明がありません",
    isbn: getIsbn(),
    imageUrl: getImageUrl(),
    targetUrl: canonicalVolumeLink || "",
  };
};
