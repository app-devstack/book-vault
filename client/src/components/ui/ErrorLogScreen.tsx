// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
//   RefreshControl,
// } from 'react-native';
// import * as Clipboard from 'expo-clipboard';
// import { getErrorLogs, clearErrorLogs } from '@/utils/errorLogger';
// import { COLORS } from '@/utils/colors';
// import { FONT_SIZES, SCREEN_PADDING } from '@/utils/constants';

/**
 * エラーログエントリ
 */
// export interface ErrorLogEntry {
//   id: string;
//   timestamp: string;
//   message: string;
//   stack?: string;
//   operation: string;
// }

// export const ErrorLogScreen: React.FC = () => {
//   const [logs, setLogs] = useState<ErrorLogEntry[]>([]);
//   const [refreshing, setRefreshing] = useState(false);

//   const loadLogs = async () => {
//     try {
//       const errorLogs = await getErrorLogs();
//       setLogs(errorLogs);
//     } catch (error) {
//       console.error('Failed to load error logs:', error);
//     }
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadLogs();
//     setRefreshing(false);
//   };

//   const handleCopyLog = async (log: ErrorLogEntry) => {
//     const logText = `
// 時刻: ${new Date(log.timestamp).toLocaleString('ja-JP')}
// 操作: ${log.operation}
// エラー: ${log.message}
// ${log.stack ? `スタック:\n${log.stack}` : ''}
//     `.trim();

//     await Clipboard.setStringAsync(logText);
//     Alert.alert('コピー完了', 'エラーログをクリップボードにコピーしました');
//   };

//   const handleClearLogs = () => {
//     Alert.alert('ログクリア', 'すべてのエラーログを削除しますか？', [
//       { text: 'キャンセル', style: 'cancel' },
//       {
//         text: '削除',
//         style: 'destructive',
//         onPress: async () => {
//           await clearErrorLogs();
//           setLogs([]);
//         },
//       },
//     ]);
//   };

//   useEffect(() => {
//     loadLogs();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>エラーログ</Text>
//         {logs.length > 0 && (
//           <TouchableOpacity onPress={handleClearLogs} style={styles.clearButton}>
//             <Text style={styles.clearButtonText}>クリア</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       >
//         {logs.length === 0 ? (
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>エラーログはありません</Text>
//           </View>
//         ) : (
//           logs.map((log) => (
//             <TouchableOpacity
//               key={log.id}
//               style={styles.logItem}
//               onPress={() => handleCopyLog(log)}
//             >
//               <View style={styles.logHeader}>
//                 <Text style={styles.logTime}>
//                   {new Date(log.timestamp).toLocaleString('ja-JP')}
//                 </Text>
//                 <Text style={styles.logOperation}>{log.operation}</Text>
//               </View>
//               <Text style={styles.logMessage}>{log.message}</Text>
//               {log.stack && (
//                 <Text style={styles.logStack} numberOfLines={3}>
//                   {log.stack}
//                 </Text>
//               )}
//               <Text style={styles.copyHint}>タップでコピー</Text>
//             </TouchableOpacity>
//           ))
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: SCREEN_PADDING,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.border,
//   },
//   title: {
//     fontSize: FONT_SIZES.large,
//     fontWeight: 'bold',
//     color: COLORS.text,
//   },
//   clearButton: {
//     backgroundColor: COLORS.error,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//   },
//   clearButtonText: {
//     color: 'white',
//     fontSize: FONT_SIZES.small,
//     fontWeight: 'bold',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: SCREEN_PADDING,
//     marginTop: 100,
//   },
//   emptyText: {
//     fontSize: FONT_SIZES.medium,
//     color: COLORS.textLight,
//     textAlign: 'center',
//   },
//   logItem: {
//     backgroundColor: 'white',
//     margin: SCREEN_PADDING,
//     marginBottom: 12,
//     padding: 16,
//     borderRadius: 8,
//     borderLeftWidth: 4,
//     borderLeftColor: COLORS.error,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//     elevation: 3,
//   },
//   logHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   logTime: {
//     fontSize: FONT_SIZES.small,
//     color: COLORS.textLight,
//   },
//   logOperation: {
//     fontSize: FONT_SIZES.small,
//     color: COLORS.primary,
//     fontWeight: 'bold',
//   },
//   logMessage: {
//     fontSize: FONT_SIZES.medium,
//     color: COLORS.text,
//     marginBottom: 8,
//     fontWeight: '500',
//   },
//   logStack: {
//     fontSize: FONT_SIZES.small,
//     color: COLORS.textLight,
//     fontFamily: 'monospace',
//     marginBottom: 8,
//     backgroundColor: '#f5f5f5',
//     padding: 8,
//     borderRadius: 4,
//   },
//   copyHint: {
//     fontSize: FONT_SIZES.xsmall,
//     color: COLORS.textLight,
//     textAlign: 'right',
//     fontStyle: 'italic',
//   },
// });
