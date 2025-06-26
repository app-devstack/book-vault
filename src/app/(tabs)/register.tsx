
const DEFAULT_REGISTER_TAB = 'api' satisfies RegisterTab;

export default function RegisterPage() {
  const [registerTab, setRegisterTab] = useState<RegisterTab>(DEFAULT_REGISTER_TAB);

  const { formData, searchResults, isSearching, searchBooks } = useBookRegistration();

  return (
    <View style={styles.container}>
      <RegisterScreen
        registerTab={registerTab}
        setRegisterTab={setRegisterTab}
        searchQuery={formData.searchQuery}
        setSearchQuery={searchBooks}
        searchResults={searchResults}
        isSearching={isSearching}
        onSearch={searchBooks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
