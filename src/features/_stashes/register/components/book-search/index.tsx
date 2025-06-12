// import { Text } from "@/components/Text";
// import { useDebounce } from "@uidotdev/usehooks";
// import React, { useState } from "react";
// import { SearchForm } from "../SearchForm";
// import { SearchResults } from "../SearchResults";
// import { useGetBookSearch } from "../hooks/useBookSearch";

// //   Debounce
// const SEARCH_INPUT_DEBOUNCE_DELAY = 500; // ミリ秒

// export default function BookSearch() {
//   const delay = SEARCH_INPUT_DEBOUNCE_DELAY;
//   const [searchTerm, setSearchTerm] = useState("");
//   const debouncedTerm = useDebounce(searchTerm, delay);

//   const { data, isLoading } = useGetBookSearch(debouncedTerm);

//   return (
//     <>
//       <SearchForm searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />

//       {isLoading && <Text>読み込み中...</Text>}

//       {data && <SearchResults data={data} />}
//     </>
//   );
// }
