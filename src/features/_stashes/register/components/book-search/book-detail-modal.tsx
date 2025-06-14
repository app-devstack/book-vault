// import Button from "@/components/ui/button";
// import { BookSearchResult } from "@/types/book";

// import { useEffect, useState } from "react";
// import {
//   Image,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// type BookDetailModalProps = {
//   visible: boolean;
//   book: BookSearchResult | null;
//   onClose: () => void;
//   onRegister: (book: BookSearchResult, targetURL: string) => Promise<void>;
// };

// export const BookDetailModal = ({
//   visible,
//   book,
//   onClose,
//   onRegister,
// }: BookDetailModalProps) => {
//   const [targetURL, setTargetURL] = useState("");
//   const [isRegistering, setIsRegistering] = useState(false);

//   useEffect(() => {
//     if (book) {
//       setTargetURL(`https://books.google.com/books?id=${book.googleBooksId}`);
//     }
//   }, [book]);

//   const handleRegister = async () => {
//     if (!book) return;

//     setIsRegistering(true);
//     try {
//       await onRegister(book, targetURL);
//       onClose();
//     } finally {
//       setIsRegistering(false);
//     }
//   };

//   if (!book) return null;

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       presentationStyle="pageSheet"
//       onRequestClose={onClose}
//     >
//       <View style={modalStyles.container}>
//         <View style={modalStyles.header}>
//           <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
//             <Text style={modalStyles.closeButtonText}>✕</Text>
//           </TouchableOpacity>
//           <Text style={modalStyles.title}>書籍詳細</Text>
//           <View style={modalStyles.placeholder} />
//         </View>

//         <ScrollView style={modalStyles.content}>
//           <View style={modalStyles.bookDetailContainer}>
//             {book.imageUrl && (
//               <Image
//                 source={{ uri: book.imageUrl }}
//                 style={modalStyles.bookImage}
//               />
//             )}

//             <View style={modalStyles.bookInfo}>
//               <Text style={modalStyles.bookTitle}>{book.title}</Text>

//               {[
//                 {
//                   key: "authors",
//                   label: "著者:",
//                   value: book.author,
//                 },
//                 {
//                   key: "publisher",
//                   label: "出版社:",
//                   value: book.publisher,
//                 },
//               ]
//                 .filter((item) => item.value)
//                 .map((item) => (
//                   <View key={item.key} style={modalStyles.infoRow}>
//                     <Text style={modalStyles.infoLabel}>{item.label}</Text>
//                     <Text style={modalStyles.infoText}>{item.value}</Text>
//                   </View>
//                 ))}
//             </View>
//           </View>

//           {book.description && (
//             <View style={modalStyles.descriptionContainer}>
//               <Text style={modalStyles.descriptionTitle}>概要</Text>
//               <Text style={modalStyles.descriptionText}>
//                 {sliceTxt(book.description.replace(/<[^>]*>/g, ""), 120)}
//               </Text>
//             </View>
//           )}

//           <View style={modalStyles.urlContainer}>
//             <Text style={modalStyles.urlLabel}>リンクURL</Text>
//             <TextInput
//               style={modalStyles.urlInput}
//               value={targetURL}
//               onChangeText={setTargetURL}
//               placeholder="書籍のリンクURLを入力"
//               multiline
//             />
//           </View>
//         </ScrollView>

//         <View style={modalStyles.footer}>
//           <Button
//             style={[modalStyles.footerButton, modalStyles.cancelButton]}
//             onPress={onClose}
//           >
//             キャンセル
//           </Button>
//           <Button
//             style={[modalStyles.footerButton, modalStyles.registerButton]}
//             onPress={handleRegister}
//             disabled={isRegistering}
//           >
//             {isRegistering ? "登録中..." : "登録"}
//           </Button>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const sliceTxt = (text: string, maxLength: number) => {
//   if (text.length <= maxLength) return text;
//   return text.slice(0, maxLength) + "...";
// };

// const modalStyles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   closeButton: {
//     padding: 8,
//   },
//   closeButtonText: {
//     fontSize: 18,
//     color: "#666",
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   placeholder: {
//     width: 34,
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   bookDetailContainer: {
//     flexDirection: "row",
//     marginBottom: 20,
//   },
//   bookImage: {
//     width: 100,
//     height: 150,
//     marginRight: 16,
//     borderRadius: 8,
//   },
//   bookInfo: {
//     flex: 1,
//   },
//   bookTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 12,
//     color: "#333",
//   },
//   infoRow: {
//     gap: 4,
//     marginBottom: 4,
//     flexDirection: "row",
//     alignItems: "baseline",
//   },
//   infoLabel: {
//     fontSize: 8,
//     fontWeight: "600",
//     color: "#9c9898",
//     marginBottom: 2,
//   },
//   infoText: {
//     fontSize: 12,
//     color: "#666",
//   },
//   descriptionContainer: {
//     marginBottom: 20,
//   },
//   descriptionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 4,
//     color: "#333",
//   },
//   descriptionText: {
//     fontSize: 12,
//     lineHeight: 20,
//     color: "#333",
//   },
//   urlContainer: {
//     marginBottom: 20,
//   },
//   urlLabel: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 8,
//     color: "#333",
//   },
//   urlInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 14,
//     minHeight: 80,
//     textAlignVertical: "top",
//   },
//   footer: {
//     flexDirection: "row",
//     padding: 16,
//     gap: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//   },
//   footerButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#313131",
//     borderWidth: 1,
//     borderColor: "#ddd",
//   },
//   registerButton: {
//     backgroundColor: "#313131",
//   },
// });
