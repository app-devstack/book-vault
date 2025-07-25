import { Layout } from '@/client/components/layout/Layout';
import { options } from '@/db';
import { SeriesWithBooks } from '@/db/types';
import { drizzle } from 'drizzle-orm/d1';

export default async function HomePage2(props: { messages: string[]; DB: D1Database }) {
  const db = drizzle(props.DB, options);

  const series = await db.query.series.findMany({ with: { books: true } });

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r bg-[#466fc9] text-white">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold mb-2">Book Vault</h1>
          </div>
        </div>

        {/* Series Grid */}
        <div className="container mx-auto px-6 py-8">
          {series.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {series.map((s) => (
                <SeriesCard key={s.id} {...s} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">
                まだシリーズがありません
              </h3>
              <p className="text-slate-500">本を登録してコレクションを始めましょう</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

const SeriesCard = (series: SeriesWithBooks) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200">
      {/* Series Header */}
      <div className="bg-gradient-to-r bg-[#466fc9] text-white p-4">
        <div className="grid gap-1">
          {/* {series.thumbnail ? (
            <img
              src={series.thumbnail}
              alt={series.title}
              className="w-16 h-20 object-cover rounded-lg shadow-md"
            />
          ) : (
            <div className="w-16 h-20 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
          )} */}
            <h2 className="text-xl font-bold line-clamp-2">{series.title}</h2>
            {series.author && <p className="text-blue-100 text-sm">{series.author}</p>}
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <span className="bg-white/20 px-2 py-1 rounded-full text-sm">{series.books.length}冊</span>
            </div>
        </div>
      </div>

      {/* Books List */}
      <div className="p-2">
        {series.books.length > 0 ? (
          <div className="space-y-2">
            {series.books
              .sort((a, b) => (a.volume || 0) - (b.volume || 0))
              .map((book) => (
                <BookItem key={book.id} book={book} />
              ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <div className="text-3xl mb-2">📖</div>
            <p className="text-sm">まだ本が登録されていません</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BookItem = ({ book }: { book: SeriesWithBooks['books'][0] }) => {
  return (
    <a
      href={book.targetUrl}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors duration-200 group border border-transparent hover:border-slate-200"
      target="_blank"
      rel="noopener noreferrer"
    >
      {book.imageUrl ? (
        <img
          src={book.imageUrl}
          alt={book.title}
          className="w-12 h-16 object-cover rounded shadow-sm"
        />
      ) : (
        <div className="w-12 h-16 bg-slate-100 rounded flex items-center justify-center">
          <span className="text-lg">📄</span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {book.volume && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
              {book.volume}巻
            </span>
          )}
        </div>
        <h3 className="font-medium text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        {book.author && book.author !== book.title && (
          <p className="text-sm text-slate-500 mt-1">{book.author}</p>
        )}
      </div>

      <div className="text-slate-400 group-hover:text-blue-600 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </div>
    </a>
  );
};
