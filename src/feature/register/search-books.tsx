import Button from "@/components/ui/button";
import { View } from "react-native";

export default function SearchBooks() {
  async function fetchHello() {
    try {
      const URL = "https://book-vault-server.maru-maru.workers.dev/api/books";
      const response = await fetch(URL);
      const data = await response.json();
      alert("a:" + JSON.stringify(data, null, 2));
    } catch (error) {
      alert("Error fetching data: " + error);
    }
  }
  return (
    <View>
      <Button onPress={() => fetchHello()}>Fetch hello</Button>;
    </View>
  );
}
