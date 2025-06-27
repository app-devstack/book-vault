import Button from '@/components/ui/button';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchFormProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export const SearchForm: React.FC<SearchFormProps> = ({ searchTerm, onSearchTermChange }) => {
  const handleSearch = () => {
    onSearchTermChange(searchTerm);
  };

  return (
    <View style={searchStyles.inputContainer}>
      <TextInput
        placeholder="書籍名を入力"
        value={searchTerm}
        onChangeText={onSearchTermChange}
        style={searchStyles.input}
      />
      <Button style={searchStyles.searchButton} onPress={handleSearch}>
        検索
      </Button>
    </View>
  );
};

const searchStyles = StyleSheet.create({
  inputContainer: {
    gap: 8,
    // marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#313131',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
});
