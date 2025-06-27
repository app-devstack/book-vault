export const fetchBooks = async (query: string) => {
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
      query
    )}&langRestrict=ja`
  );
  if (!response.ok) {
    throw new Error('データの取得に失敗しました');
  }
  return response.json();
};
