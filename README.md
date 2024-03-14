> **Note:** Starting from `v3`, tabler-icons now officially supports React Native. You no longer need to convert the icons manually. Simply install the package and follow the [documentation](https://tabler.io/docs/icons/react-native) to use the icons in your Expo project.

# Tabler Icons to Expo

This project automatically converts the latest version of [tabler-icons](https://tabler-icons.io) icons into a format that can be used by the `createIconSet` method of [@expo/vector-icons](https://docs.expo.dev/guides/icons/).

## Table of Contents

- [Usage](#usage)
- [Upgrade](#upgrade)

## Usage

To use tabler-icons in your Expo project, we will use the `createIconSet` method provided by the [@expo/vector-icons](https://docs.expo.dev/guides/icons/) package to add a new set of icons.

To begin with, you need to add the `glyph-map.json` and `tabler-icons.ttf` files that you can find in the `output/` directory of this repository.

For this example, they will be placed in `assets/tabler-icons/2.16.0/` of our project.

Next, we have to load the font file (ttf) in our `App.tsx|js`:

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

You can also use the `useFonts` hook to load the font. For more information, refer to the [documentation](https://docs.expo.dev/versions/latest/sdk/font/).

Now, we will create a TablerIcon component (which you can name whatever you want) and then export it.

```tsx
// tabler-icons.tsx

import { createIconSet } from "@expo/vector-icons";

const glyphMap = require("../assets/tabler-icons/2.16.0/glyph-map.json");
const TablerIcon = createIconSet(glyphMap, "tabler-icons", "tabler-icons.ttf");

export default TablerIcon;
```

And that's it! You can now use your new component wherever you want.

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

To update tabler-icons to its latest version, simply replace the `glyph-map.json` and `tabler-icons.ttf` files.

If the latest version is not available in the `output/` folder of this repository, you can easily build them by cloning this repo.

**Requirement:** Node `v18+`

```sh
npm install
```

Then run the build command:

```sh
npm start
```

And if everything goes well, your files will be available in the `output/` directory:

```
Downloading 2 files..
Extracting version..
Extracting glyphs..
Building output..
Version 2.16.0 successfully built in output/2.16.0/
```
