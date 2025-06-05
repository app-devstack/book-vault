// App.tsx - 修正版
import React, { useState } from "react";
import { TabNavigation } from "./components/ui/TabNavigation";
import { useBooks } from "./hooks/useBooks";
import { useSearch } from "./hooks/useSearch";
import { HomeScreen } from "./screens/HomeScreen";
import { RegisterScreen } from "./screens/RegisterScreen";
import { SeriesDetailScreen } from "./screens/SeriesDetailScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { RegisterTabType, TabType } from "./types/book";
import { COLORS } from "./utils/colors";

const MangaManagerApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");
  const [registerTab, setRegisterTab] = useState<RegisterTabType>("api");
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null);

  // カスタムフックを使用
  const { books, groupedBooks, getSeriesStats, addBook } = useBooks();
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchBooks,
  } = useSearch();

  // イベントハンドラー
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSelectedSeries(null);
  };

  const handleRegisterClick = () => {
    setActiveTab("register");
  };

  const handleSeriesSelect = (seriesTitle: string) => {
    setSelectedSeries(seriesTitle);
  };

  const handleBackToHome = () => {
    setSelectedSeries(null);
  };

  const handleAddBook = (bookData: any, store: any) => {
    addBook(bookData, store);
    setActiveTab("home");
  };

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
          getSeriesStats={getSeriesStats}
          onBack={handleBackToHome}
        />
      ) : (
        <>
          {activeTab === "home" && (
            <HomeScreen
              books={books}
              groupedBooks={groupedBooks}
              onSeriesSelect={handleSeriesSelect}
              onRegisterClick={handleRegisterClick}
              getSeriesStats={getSeriesStats}
            />
          )}
          {activeTab === "register" && (
            <RegisterScreen
              registerTab={registerTab}
              onRegisterTabChange={setRegisterTab}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              searchResults={searchResults}
              isSearching={isSearching}
              onSearch={searchBooks}
              onAddBook={handleAddBook}
            />
          )}
          {activeTab === "settings" && <SettingsScreen />}
        </>
      )}

      {/* フッタータブナビゲーション */}
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default MangaManagerApp;
