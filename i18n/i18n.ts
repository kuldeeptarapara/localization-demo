import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import GridlyBackend, { GridlyBackendOptions } from "i18next-gridly-backend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import demo from "./demo.json";

const VIEW_ID = "tz8qosssrut37";
const API_KEY = "VVHfJDj4lVlAvs";

var myHeaders = new Headers();
myHeaders.append("Authorization", `ApiKey ${API_KEY}`);

interface Cell {
  columnId: string;
  sourceStatus?: string;
  dependencyStatus?: string;
  value: string;
}

interface Item {
  id: string;
  cells: Cell[];
}

interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

const fallback: Item[] = demo;

const gridlyOptions: GridlyBackendOptions = {
  apiKey: "VVHfJDj4lVlAvs",
  viewId: "ewvj03vkqple1jo",
};

const convertToTranslations = (data: Item[]): Translations => {
  const translations: Translations = {};

  data.forEach((item: Item) => {
    item.cells.forEach((cell: Cell) => {
      if (!translations[cell.columnId]) {
        translations[cell.columnId] = {};
      }
      translations[cell.columnId][item.id] = cell.value;
    });
  });
  return translations;
};

const getTranslations = async () => {
  let translations: Translations = {};
  let resData: Item[] = [];
  try {
    const response = await fetch(
      `https://api.gridly.com/v1/views/${VIEW_ID}/records`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    );
    if (response.ok) {
      resData = await response.json();
    }
    translations = convertToTranslations(resData);
  } catch (error) {
    const localTranslations = await AsyncStorage.getItem("translations");
    if (localTranslations) {
      translations = JSON.parse(localTranslations);
    } else {
      translations = convertToTranslations(fallback);
    }
  }
  return translations;
};

i18n
  .use(GridlyBackend)
  .use(initReactI18next)
  .init({
    lng: "en",
    compatibilityJSON: "v3",
    fallbackLng: "en",
    debug: true,
    backend: gridlyOptions,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });

(async () => {
  const translations = await getTranslations();
  Object.keys(translations).forEach((key) => {
    i18n.addResources(key, "translation", translations[key]);
  });
  AsyncStorage.setItem(`translations`, JSON.stringify(translations));
})();

export default i18n;
