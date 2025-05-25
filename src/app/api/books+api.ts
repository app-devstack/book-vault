import mockdata from "./_mockdata.json";

export function GET(request: Request) {
  const results = mockdata;

  if (!results) {
    Response.json([]);
  }

  const { items } = mockdata;

  const data = items.map((item) => ({
    id: item.id,
    title: item.volumeInfo.title,
    authors: item.volumeInfo.authors,
    publisher: item.volumeInfo.publisher,
    description: item.volumeInfo.description,
    // publishedDate: item.volumeInfo.publishedDate,
    imageLinks: item.volumeInfo.imageLinks,
    previewLink: item.volumeInfo.previewLink,
    infoLink: item.volumeInfo.infoLink,
    pageCount: item.volumeInfo.pageCount,
  }));

  return Response.json(data);
}
