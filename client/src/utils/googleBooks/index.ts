import { BookSearchResult } from '@/types/book';
import { BookSearchItemType } from '@/utils/googleBooks/types';
import { Linking } from 'react-native';

/**
 * Google Books APIのレスポンスを内部形式に変換する関数
 * @param item - Google Books APIのbook item
 * @returns BookSearchResult - 内部形式の書籍データ
 */
export const transformBookSearchItem = async (
  item: BookSearchItemType
): Promise<BookSearchResult> => {
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
    const candidate = seriesInfo?.bookDisplayNumber || seriesInfo?.volumeSeries[0].orderNumber;
    const parsed = Number(candidate);
    return isNaN(parsed) ? undefined : parsed;
  };
  // ISBNの取得
  const getIsbn = (): string | undefined => {
    return industryIdentifiers[0]?.identifier;
  };

  // 画像URLの取得
  // const getImageUrl = (): string | undefined => {
  //   return imageLinks?.thumbnail || imageLinks?.smallThumbnail;
  // };

  const imageUrl = (await getSafeImageUrl({ imageLinks })) || undefined;

  return {
    googleBooksId: item.id,
    title: title || '不明なタイトル',
    author: authors?.join(', ') || '不明な著者',
    volume: extractVolumeNumber(),
    publisher: publisher || '不明な出版社',
    description: description || '説明がありません',
    isbn: getIsbn(),
    imageUrl: imageUrl,
    targetUrl: canonicalVolumeLink || '',

    seriesId: seriesInfo?.volumeSeries[0].seriesId || '',
  };
};

type GoogleThumbnailType = Pick<BookSearchItemType['volumeInfo'], 'imageLinks'>;
type ImageLinksType = GoogleThumbnailType['imageLinks'];

/**
 * 画像URLを安全に取得する（フォールバック付き）
 * @param {Object} book - Google Books APIのbook object
 * @returns {Promise<string|null>} - 有効な画像URLまたはnull
 */
export const getSafeImageUrl = async ({ imageLinks }: GoogleThumbnailType) => {
  const { validImages } = await validateBookImages(imageLinks);

  // thumbnailを優先し、なければsmallThumbnailを使用
  return validImages.thumbnail || validImages.smallThumbnail || null;
};

/**
 * Google Books API用の画像URL検証
 * @param {Object} book - Google Books APIのbook object
 * @returns {Promise<{validImages: Object, errors: string[]}>}
 */
export const validateBookImages = async (imageLinks: ImageLinksType) => {
  const errors: string[] = [];
  const validImages = {} as Record<string, string>;

  if (!imageLinks) {
    return { validImages: {}, errors: ['No image links found'] };
  }

  // thumbnailとsmallThumbnailの両方をチェック
  const imagesToCheck: { key: string; url: string }[] = [
    { key: 'thumbnail', url: imageLinks.thumbnail || '' },
    { key: 'smallThumbnail', url: imageLinks.smallThumbnail || '' },
  ].filter((item) => item.url !== '');

  const results = await Promise.all(
    imagesToCheck.map(async ({ key, url }) => {
      const result = await validateAndConvertUrl(url);
      return { key, ...result };
    })
  );

  results.forEach(({ key, isValid, url, error }) => {
    if (isValid) {
      validImages[key] = url;
    } else {
      errors.push(`${key}: ${error || 'Invalid URL'}`);
    }
  });

  return { validImages, errors };
};

/**
 * HTTPからHTTPSに変換し、URLが開けるかどうかを確認する
 * @param {string} url - 確認するURL
 * @returns {Promise<{isValid: boolean, url: string, error?: string}>}
 */
export const validateAndConvertUrl = async (url: string) => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, url: '', error: 'Invalid URL provided' };
  }

  // HTTPからHTTPSに変換
  const secureUrl = url.replace(/^http:\/\//, 'https://');

  try {
    const canOpen = await Linking.canOpenURL(secureUrl);

    if (canOpen) {
      return { isValid: true, url: secureUrl };
    } else {
      return {
        isValid: false,
        url: secureUrl,
        error: 'URL cannot be opened',
      };
    }
  } catch (error) {
    console.error(error);

    return {
      isValid: false,
      url: secureUrl,
      // error: error.message || 'Unknown error occurred'
      error: 'Unknown error occurred',
    };
  }
};
