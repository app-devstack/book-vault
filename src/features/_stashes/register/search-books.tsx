// import Button from "@/components/ui/button";
// import { bookService } from "@/utils/service/book-service";

// import { useQuery } from "@tanstack/react-query";
// import React, { useState } from "react";
// import {
//   Alert,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";

// // export function SearchBooks() {
// //   async function fetchHello() {
// //     try {
// //       const URL = "https://book-vault-server.maru-maru.workers.dev/api/books";
// //       const response = await fetch(URL);
// //       const data = await response.json();
// //       alert("a:" + JSON.stringify(data, null, 2));
// //     } catch (error) {
// //       alert("Error fetching data: " + error);
// //     }
// //   }
// //   return (
// //     <>
// //       <Button onPress={() => fetchHello()}>Fetch hello</Button>;
// //     </>
// //   );
// // }

// const fetchBooks = async (query: string) => {
//   const response = await fetch(
//     `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
//       query
//     )}&langRestrict=ja`
//   );
//   if (!response.ok) {
//     throw new Error("データの取得に失敗しました");
//   }
//   return response.json();
// };

// type GoogleBooksResponse = {
//   items: {
//     id: string;
//     volumeInfo: {
//       title: string;
//       authors?: string[];
//       imageLinks?: {
//         thumbnail: string;
//       };
//     };
//   }[];
// };

// export default function BookSearch() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [submittedTerm, setSubmittedTerm] = useState("");

//   const { data, isLoading } = useQuery<GoogleBooksResponse>({
//     queryKey: ["books", submittedTerm],
//     queryFn: () => fetchBooks(submittedTerm),
//     enabled: !!submittedTerm,
//   });

//   const handleBookRegister = async (
//     book: GoogleBooksResponse["items"][number]
//   ) => {
//     try {
//       await bookService.createBook({
//         id: book.id,
//         title: book.volumeInfo.title,
//         targetURL: `https://books.google.com/books?id=${book.id}`,
//         imageURL: book.volumeInfo.imageLinks?.thumbnail || "",
//         addedAt: new Date(),
//       });
//       // 成功メッセージの表示
//       Alert.alert("本が正常に登録されました");
//     } catch (error) {
//       console.error("登録エラー:", error);
//       Alert.alert("登録に失敗しました");
//     }
//   };

//   return (
//     <View style={styles.inputContainer}>
//       <TextInput
//         placeholder="書籍名を入力"
//         value={searchTerm}
//         onChangeText={setSearchTerm}
//         // style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
//         style={styles.input}
//       />
//       <Button
//         style={styles.button}
//         onPress={() => setSubmittedTerm(searchTerm)}
//       >
//         検索
//       </Button>

//       {isLoading && <Text>読み込み中...</Text>}

//       {data && data.items && data.items.length === 0 && (
//         <Text>検索結果が見つかりませんでした</Text>
//       )}

//       {data ? (
//         <FlatList
//           data={data.items}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={{ flexDirection: "row", marginVertical: 8 }}>
//               {item.volumeInfo.imageLinks?.thumbnail && (
//                 <Image
//                   source={{ uri: item.volumeInfo.imageLinks.thumbnail }}
//                   style={{ width: 50, height: 75, marginRight: 8 }}
//                 />
//               )}
//               <View style={{ flex: 1 }}>
//                 <Text style={{ fontWeight: "bold" }}>
//                   {item.volumeInfo.title}
//                 </Text>
//                 <Text>{item.volumeInfo.authors?.join(", ")}</Text>
//                 <Button
//                   onPress={() => handleBookRegister(item)}
//                   style={{ marginTop: 8 }}
//                   textStyle={{ color: "##313131" }}
//                 >
//                   登録
//                 </Button>
//               </View>
//             </View>
//           )}
//         />
//       ) : (
//         <></>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 16,
//     gap: 16,
//   },
//   inputContainer: {
//     gap: 8,
//   },
//   label: {
//     fontSize: 17,
//     marginBottom: 4,
//   },
//   input: {
//     height: 40,
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: "#fff",
//     borderColor: "#ccc",
//   },
//   button: {
//     backgroundColor: "#313131",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
// });
