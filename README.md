# Tabler Icons to Expo

Ce projet permet de convertir automatiquement la dernière version des icones de [tabler-icons](https://tabler-icons.io) dans un format utilisable par la fonction `createIconSet` de [@expo/vector-icons](https://docs.expo.dev/guides/icons/).

## Table of Contents

- [Usage](#usage)
- [Upgrade](#upgrade)

## Usage

Pour utiliser tabler-icons dans votre projet, on va utiliser la fonction `createIconSet` présente dans le package [@expo/vector-icons](https://docs.expo.dev/guides/icons/) afin d'y ajouter un nouveau set d'icones.

Pour commencer il faut ajouter les fichiers `glyph-map.json` et `tabler-icons.ttf` que vous pouvez trouver dans le dossier `output/` de ce repository.

Pour cet exemple ils seront placés dans : `assets/tabler-icons/2.16.0/`

On vient ensuite charger le fichier de font (ttf) dans notre `App.tsx|js` :

```tsx
// App.tsx

import * as Font from "expo-font";
// ...

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  // ...

  useEffect(() => {
    async function prepare() {
      try {
        // ...

        await Font.loadAsync(
          "tabler-icons",
          require("./assets/tabler-icons/2.16.0/tabler-icons.ttf")
        );

        // ...

        setAppIsReady(true);
      } catch (e) {
        // ...
      }
    }

    prepare();
  }, []);

  // ...
}
```

Vous pouvez aussi utiliser le `useFonts` hook pour charger la font. Pour plus d'informations référez-vous à la [documentation](https://docs.expo.dev/versions/latest/sdk/font/).

On vient ensuite créer un composant TablerIcon (que vous pouvez nommer comme vous voulez) puis on l'export.

```tsx
// tabler-icons.tsx

import { createIconSet } from "@expo/vector-icons";

const glyphMap = require("../assets/tabler-icons/2.16.0/glyph-map.json");
const TablerIcon = createIconSet(glyphMap, "tabler-icons", "tabler-icons.ttf");

export default TablerIcon;
```

Et voilà ! Vous pouvez maintenant utiliser votre nouveau composant ou vous souhaitez.

```tsx
// MyScreen.tsx

import TablerIcon from "../../components/tabler-icon";

export default function MyScreen() {
  return (
    <View>
      <TablerIcon name="heart" size={30} color="red" />
    </View>
  );
}
```

Enjoy ! 😉

## Upgrade

Pour mettre à jour [tabler-icons](https://tabler-icons.io) dans sa dernière version, ils vous suffit simplement de remplacer les fichiers `glyph-map.json` et `tabler-icons.ttf`.

Si la dernière version n'est pas disponible dans le dossier `output/` du repository vous pouvez les construire très facilement en clonant ce repo.

**Requirement :** Node `v18+`

```sh
npm install
```

Puis lancer la construction :

```sh
npm start
```

Et si tout se passe bien vos fichiers seront disponibles dans le dossier `output/` :

```
Downloading 2 files..
Extracting version..
Extracting glyphs..
Building output..
Version 2.16.0 successfully built in output/2.16.0/
```
