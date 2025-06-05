import React, { useState } from "react";

// アイコンコンポーネント（lucide-reactの代替）
const Search = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const Home = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

const Plus = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Settings = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m11-5a11 11 0 0 1-11 11 11 11 0 0 1-11-11 11 11 0 0 1 11-11 11 11 0 0 1 11 11z"></path>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const ExternalLink = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15,3 21,3 21,9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

const ArrowLeft = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const ChevronRight = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);
const COLORS = {
  primary: "#4A90E2", // リーフィアブルー
  primaryDark: "#357ABD",
  primaryLight: "#7BB3F0",
  accent: "#88C999", // 薄緑のアクセント
  background: "#F0F8FF", // アリスブルー背景
  card: "#FFFFFF",
  text: "#2C3E50",
  textLight: "#5D6D7E",
  border: "#D6EAF8",
  success: "#27AE60",
  warning: "#F39C12",
};

// ストアの定義
const STORES = {
  kindle: {
    name: "Kindle",
    color: "#FF9500",
    url: "https://kindle.amazon.co.jp",
  },
  kobo: {
    name: "楽天Kobo",
    color: "#ED1C24",
    url: "https://books.rakuten.co.jp",
  },
  bookwalker: {
    name: "BookWalker",
    color: "#00A0DC",
    url: "https://bookwalker.jp",
  },
};

const MangaManagerApp = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [registerTab, setRegisterTab] = useState("api");
  const [books, setBooks] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null);

  // シリーズごとにグループ化
  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.title]) {
      acc[book.title] = [];
    }
    acc[book.title].push(book);
    return acc;
  }, {});

  // 各シリーズの統計を計算
  const getSeriesStats = (seriesBooks) => {
    const volumes = seriesBooks
      .map((book) => book.volume)
      .sort((a, b) => a - b);
    const stores = [...new Set(seriesBooks.map((book) => book.store))];
    const totalPrice = seriesBooks.reduce((sum, book) => sum + book.price, 0);
    return {
      volumeCount: volumes.length,
      minVolume: Math.min(...volumes),
      maxVolume: Math.max(...volumes),
      stores,
      totalPrice,
      latestPurchase: new Date(
        Math.max(...seriesBooks.map((book) => new Date(book.purchaseDate)))
      ),
    };
  };

  // Google Books API検索（モック）
  const searchBooks = async (query) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setTimeout(() => {
      const mockResults = [
        {
          id: "mock1",
          title: query + " 1巻",
          author: "作者名",
          thumbnail: `https://via.placeholder.com/120x160/${COLORS.primary.slice(
            1
          )}/FFFFFF?text=${encodeURIComponent(query)}1`,
          description: `${query}の第1巻です。面白いストーリーが展開されます。`,
        },
        {
          id: "mock2",
          title: query + " 2巻",
          author: "作者名",
          thumbnail: `https://via.placeholder.com/120x160/${COLORS.primaryDark.slice(
            1
          )}/FFFFFF?text=${encodeURIComponent(query)}2`,
          description: `${query}の第2巻です。物語がさらに盛り上がります。`,
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 800);
  };

  // 本を登録
  const addBook = (bookData, store) => {
    const newBook = {
      id: Date.now(),
      ...bookData,
      store,
      purchaseDate: new Date().toISOString().split("T")[0],
      price: Math.floor(Math.random() * 500) + 400,
      url: `${STORES[store].url}/example${Date.now()}`,
    };
    setBooks([...books, newBook]);
    setActiveTab("home");
  };

  // シリーズ詳細画面
  const SeriesDetailScreen = ({ seriesTitle, seriesBooks }) => {
    const stats = getSeriesStats(seriesBooks);
    const sortedBooks = [...seriesBooks].sort((a, b) => b.volume - a.volume);

    return (
      <div
        style={{
          padding: "20px",
          paddingBottom: "100px",
          background: COLORS.background,
          minHeight: "100vh",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setSelectedSeries(null)}
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "12px",
              width: "44px",
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: COLORS.primary,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                color: COLORS.text,
                margin: 0,
              }}
            >
              {seriesTitle}
            </h1>
            <p
              style={{
                fontSize: "14px",
                color: COLORS.textLight,
                margin: "4px 0 0 0",
              }}
            >
              {seriesBooks[0].author}
            </p>
          </div>
        </div>

        {/* 統計カード */}
        <div
          style={{
            background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
            color: "white",
            boxShadow: "0 8px 24px rgba(74, 144, 226, 0.3)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "20px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                {stats.volumeCount}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>所有巻数</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                ¥{stats.totalPrice.toLocaleString()}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>総購入額</div>
            </div>
          </div>
          <div
            style={{
              marginTop: "16px",
              paddingTop: "16px",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "12px", opacity: 0.9 }}>購入ストア:</span>
            {stats.stores.map((store) => (
              <div
                key={store}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "4px 8px",
                  borderRadius: "12px",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              >
                {STORES[store].name}
              </div>
            ))}
          </div>
        </div>

        {/* 巻リスト */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {sortedBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => window.open(book.url, "_blank")}
              style={{
                background: COLORS.card,
                borderRadius: "16px",
                padding: "16px",
                boxShadow: `0 4px 16px rgba(0,0,0,0.08)`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: `2px solid ${STORES[book.store].color}20`,
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
              }}
            >
              <img
                src={book.thumbnail}
                alt={`${book.title} ${book.volume}巻`}
                style={{
                  width: "60px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: COLORS.text,
                    marginBottom: "4px",
                  }}
                >
                  第{book.volume}巻
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: STORES[book.store].color,
                    fontWeight: "bold",
                    marginBottom: "4px",
                  }}
                >
                  {STORES[book.store].name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: COLORS.textLight,
                  }}
                >
                  {new Date(book.purchaseDate).toLocaleDateString("ja-JP")} • ¥
                  {book.price}
                </div>
              </div>
              <div
                style={{
                  background: COLORS.primary,
                  borderRadius: "12px",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                <ExternalLink size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ホーム画面
  const HomeScreen = () => (
    <div
      style={{
        padding: "20px",
        paddingBottom: "100px",
        background: COLORS.background,
        minHeight: "100vh",
      }}
    >
      {books.length === 0 ? (
        // 空の状態
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: COLORS.textLight,
          }}
        >
          <div style={{ fontSize: "80px", marginBottom: "20px" }}>📚</div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: COLORS.text,
            }}
          >
            まだ本が登録されていません
          </div>
          <div style={{ fontSize: "14px", marginBottom: "24px" }}>
            「登録」タブからお気に入りの本を追加してみましょう！
          </div>
          <button
            onClick={() => setActiveTab("register")}
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(74, 144, 226, 0.3)",
            }}
          >
            本を登録する
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              borderRadius: "24px",
              padding: "24px",
              marginBottom: "24px",
              textAlign: "center",
              color: "white",
              boxShadow: "0 8px 24px rgba(74, 144, 226, 0.3)",
            }}
          >
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              📚 本ライブラリ
            </div>
            <div
              style={{ fontSize: "16px", opacity: 0.9, marginBottom: "12px" }}
            >
              {Object.keys(groupedBooks).length}シリーズ • {books.length}冊
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                padding: "8px 16px",
                display: "inline-block",
                fontSize: "14px",
              }}
            >
              総額: ¥
              {books
                .reduce((sum, book) => sum + book.price, 0)
                .toLocaleString()}
            </div>
          </div>

          {/* シリーズリスト */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {Object.entries(groupedBooks).map(([seriesTitle, seriesBooks]) => {
              const stats = getSeriesStats(seriesBooks);
              const latestBook = seriesBooks.reduce((latest, book) =>
                new Date(book.purchaseDate) > new Date(latest.purchaseDate)
                  ? book
                  : latest
              );

              return (
                <div
                  key={seriesTitle}
                  onClick={() => setSelectedSeries(seriesTitle)}
                  style={{
                    background: COLORS.card,
                    borderRadius: "20px",
                    padding: "20px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    border: `1px solid ${COLORS.border}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(0,0,0,0.15)";
                    e.currentTarget.style.borderColor = COLORS.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(0,0,0,0.08)";
                    e.currentTarget.style.borderColor = COLORS.border;
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={latestBook.thumbnail}
                      alt={seriesTitle}
                      style={{
                        width: "80px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: COLORS.text,
                          marginBottom: "6px",
                        }}
                      >
                        {seriesTitle}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: COLORS.textLight,
                          marginBottom: "12px",
                        }}
                      >
                        {seriesBooks[0].author}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            background: COLORS.primary + "20",
                            color: COLORS.primary,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          {stats.volumeCount}冊所有
                        </div>
                        <div
                          style={{
                            background: COLORS.accent + "20",
                            color: COLORS.success,
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          ¥{stats.totalPrice.toLocaleString()}
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                          alignItems: "center",
                        }}
                      >
                        {stats.stores.map((store) => (
                          <div
                            key={store}
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              background: STORES[store].color,
                            }}
                          />
                        ))}
                        <span
                          style={{
                            fontSize: "11px",
                            color: COLORS.textLight,
                            marginLeft: "4px",
                          }}
                        >
                          {stats.stores.length}ストア
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        background: COLORS.primary,
                        borderRadius: "12px",
                        width: "44px",
                        height: "44px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  // 登録画面
  const RegisterScreen = () => (
    <div
      style={{
        padding: "20px",
        paddingBottom: "100px",
        background: COLORS.background,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          marginBottom: "24px",
          background: COLORS.card,
          borderRadius: "16px",
          padding: "6px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          border: `1px solid ${COLORS.border}`,
        }}
      >
        <button
          onClick={() => setRegisterTab("gmail")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background:
              registerTab === "gmail" ? COLORS.primary : "transparent",
            color: registerTab === "gmail" ? "white" : COLORS.textLight,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          📧 Gmail連携
        </button>
        <button
          onClick={() => setRegisterTab("api")}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: registerTab === "api" ? COLORS.primary : "transparent",
            color: registerTab === "api" ? "white" : COLORS.textLight,
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          🔍 タイトル検索
        </button>
      </div>

      {registerTab === "gmail" ? (
        <div
          style={{
            background: COLORS.card,
            borderRadius: "20px",
            padding: "40px",
            textAlign: "center",
            border: `2px dashed ${COLORS.border}`,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🚧</div>
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: COLORS.warning,
            }}
          >
            準備中です
          </div>
          <div style={{ fontSize: "14px", color: COLORS.textLight }}>
            Gmail連携機能は現在開発中です。
            <br />
            しばらくお待ちください。
          </div>
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              marginBottom: "24px",
              background: COLORS.card,
              borderRadius: "16px",
              border: `2px solid ${COLORS.primary}`,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <input
              type="text"
              placeholder="本タイトルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBooks(searchQuery)}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: "none",
                outline: "none",
                fontSize: "16px",
                color: COLORS.text,
                background: "transparent",
              }}
            />
            <button
              onClick={() => searchBooks(searchQuery)}
              disabled={isSearching}
              style={{
                padding: "16px 24px",
                background: COLORS.primary,
                border: "none",
                cursor: "pointer",
                color: "white",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.target.style.background = COLORS.primaryDark)
              }
              onMouseLeave={(e) => (e.target.style.background = COLORS.primary)}
            >
              {isSearching ? "🔄" : <Search size={20} />}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div>
              <h3
                style={{
                  marginBottom: "16px",
                  color: COLORS.text,
                  fontSize: "18px",
                  fontWeight: "bold",
                }}
              >
                検索結果
              </h3>
              {searchResults.map((result) => (
                <div
                  key={result.id}
                  style={{
                    background: COLORS.card,
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    display: "flex",
                    gap: "20px",
                    border: `1px solid ${COLORS.border}`,
                  }}
                >
                  <img
                    src={result.thumbnail}
                    alt={result.title}
                    style={{
                      width: "100px",
                      height: "130px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        marginBottom: "6px",
                        color: COLORS.text,
                      }}
                    >
                      {result.title}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: COLORS.textLight,
                        marginBottom: "12px",
                      }}
                    >
                      {result.author}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: COLORS.textLight,
                        marginBottom: "20px",
                        lineHeight: "1.4",
                      }}
                    >
                      {result.description}
                    </div>
                    <div
                      style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                    >
                      {Object.entries(STORES).map(([key, store]) => (
                        <button
                          key={key}
                          onClick={() =>
                            addBook(
                              {
                                title: result.title.replace(/\s*\d+巻$/, ""),
                                volume: parseInt(
                                  result.title.match(/(\d+)巻/) || [0, 1]
                                )[1],
                                author: result.author,
                                thumbnail: result.thumbnail,
                              },
                              key
                            )
                          }
                          style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            border: "none",
                            background: store.color,
                            color: "white",
                            fontSize: "12px",
                            cursor: "pointer",
                            fontWeight: "bold",
                            transition: "transform 0.2s ease",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "translateY(-1px)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "translateY(0)")
                          }
                        >
                          {store.name}に登録
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // 設定画面（作成済みのため空実装）
  const SettingsScreen = () => (
    <div
      style={{
        padding: "20px",
        paddingBottom: "100px",
        background: COLORS.background,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: COLORS.textLight,
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>⚙️</div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: COLORS.text,
          }}
        >
          設定画面
        </div>
        <div style={{ fontSize: "14px" }}>
          こちらは作成済みとのことなので、実装は省略しています。
        </div>
      </div>
    </div>
  );

  // メインレンダリング
  return (
    <div
      style={{
        fontFamily: "'Hiragino Sans', 'ヒラギノ角ゴシック', sans-serif",
        background: COLORS.background,
        minHeight: "100vh",
        position: "relative",
      }}
    >
      {/* メインコンテンツ */}
      {selectedSeries ? (
        <SeriesDetailScreen
          seriesTitle={selectedSeries}
          seriesBooks={groupedBooks[selectedSeries]}
        />
      ) : (
        <>
          {activeTab === "home" && <HomeScreen />}
          {activeTab === "register" && <RegisterScreen />}
          {activeTab === "settings" && <SettingsScreen />}
        </>
      )}

      {/* フッタータブナビゲーション */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: COLORS.card,
          borderTop: `1px solid ${COLORS.border}`,
          display: "flex",
          justifyContent: "space-around",
          padding: "12px 0 20px 0",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <button
          onClick={() => {
            setActiveTab("home");
            setSelectedSeries(null);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            padding: "8px 16px",
            color: activeTab === "home" ? COLORS.primary : COLORS.textLight,
            transition: "all 0.2s ease",
          }}
        >
          <Home size={24} />
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>ホーム</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("register");
            setSelectedSeries(null);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            padding: "8px 16px",
            color: activeTab === "register" ? COLORS.primary : COLORS.textLight,
            transition: "all 0.2s ease",
          }}
        >
          <Plus size={24} />
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>登録</span>
        </button>

        <button
          onClick={() => {
            setActiveTab("settings");
            setSelectedSeries(null);
          }}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            padding: "8px 16px",
            color: activeTab === "settings" ? COLORS.primary : COLORS.textLight,
            transition: "all 0.2s ease",
          }}
        >
          <Settings size={24} />
          <span style={{ fontSize: "12px", fontWeight: "bold" }}>設定</span>
        </button>
      </div>
    </div>
  );
};

export default MangaManagerApp;
