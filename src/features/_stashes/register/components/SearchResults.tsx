// import { Text } from "@/components/Text";
// import { BookSearchItemType } from "@/utils/googleBooks/types";
// import { bookService } from "@/utils/service/book-service";
// import React, { useState } from "react";
// import { Alert, FlatList, StyleSheet } from "react-native";
// import { BookDetailModal } from "./book-search/book-detail-modal";

// interface SearchResultsProps {
//   data: BookSearchItemType[];

//   // searchTerm: string;
//   // onBookSelect: (book: BookSearchItemType) => void;
// }

// export const SearchResults = ({ data }: SearchResultsProps) => {
//   const [selectedBook, setSelectedBook] = useState<BookSearchItemType | null>(
//     null
//   );
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const handleBookSelect = (book: BookSearchItemType) => {
//     setSelectedBook(book);
//     setIsModalVisible(true);
//   };

//   const closeModal = () => {
//     setIsModalVisible(false);
//     setSelectedBook(null);
//   };

//   const handleBookRegister = async (
//     book: BookSearchItemType,
//     targetURL: string
//   ) => {
//     try {
//       await bookService.createBook({
//         id: book.id,
//         title: book.volumeInfo.title,
//         targetUrl: targetURL,
//         imageUrl: book.volumeInfo.imageLinks?.thumbnail || "",
//       });

//       Alert.alert("成功", "本が正常に登録されました");
//       closeModal();
//     } catch (error) {
//       console.error("登録エラー:", error);
//       Alert.alert("エラー", "登録に失敗しました");
//     }
//   };

//   return (
//     <>
//       {data.length === 0 && (
//         <Text style={searchStyles.statusText}>
//           検索結果が見つかりませんでした
//         </Text>
//       )}

//       <FlatList
//         data={data}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           // <BookItem item={item} onPress={handleBookSelect} />
//           <></>
//         )}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={searchStyles.listContent}
//       />

//       <BookDetailModal
//         visible={isModalVisible}
//         book={selectedBook}
//         onClose={closeModal}
//         onRegister={handleBookRegister}
//       />
//     </>
//   );
// };

// const searchStyles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // backgroundColor: "#f9f9f9",
//   },
//   statusText: {
//     textAlign: "center",
//     color: "#666",
//     fontSize: 16,
//     marginTop: 20,
//   },
//   listContent: {
//     paddingBottom: 100,
//   },
// });
