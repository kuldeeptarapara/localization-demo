import { StyleSheet, Text, View, Button } from "react-native";
import { useTranslation } from "react-i18next";
import i18n from "./i18n/i18n";

export default function App() {
  const { t } = useTranslation();

  // List of the languages you want to support,
  const languages = [
    { value: "en", name: "English" },
    { value: "ja", name: "Japanese" },
    { value: "fr", name: "French" },
    { value: "sv", name: "Swedish" },
  ];
  return (
    <View style={styles.container}>
      <View style={styles.buttContainer}>
        {/* Render button for all languages */}
        {languages.map((lng) => (
          <Button
            key={lng.value}
            title={lng.name}
            onPress={() => i18n.changeLanguage(lng.value)}
          />
        ))}
      </View>
      <Text>{t("description")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: 100,
    padding: 20,
  },
  buttContainer: {
    flexDirection: "column",
    gap: 30,
  },
});
