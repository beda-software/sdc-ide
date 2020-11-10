## Installation

-   To create project from web template

```sh
npx create-react-app web --template file:template-web
```

-   To create project from mobile template. For `--template` parameter use absolute path to the template

```sh
npx react-native init MobileAppName --template file://${FullPathToProjectDir}/template-mobile --directory mobile
```

-   Add `shared` workspace to projects dependencies

```sh
yarn workspace web add shared@0.0.1
yarn workspace mobile add shared@0.0.1
yarn prepare
```

-   Add `src/services/initialize.ts` file to mobile and web projects

```javascript
import { baseURL } from 'shared/lib/constants.develop';

import { setInstanceBaseURL } from 'aidbox-react/lib/services/instance';

setInstanceBaseURL(baseURL!);

export { baseURL };
```

### yarn start

```sh
yarn start           # start watch all workspaces
yarn start:web       # start watch web workspace
yarn start:mobile    # start watch mobile workspace
```

### yarn test

```sh
yarn test            # launch tests for all workspaces
yarn test:web        # launch tests for web workspace
yarn test:mobile     # launch tests for mobile workspace
```

## Troubleshooting

-   Do not forget to add mobile native dependencies to `frontend/package.json` to workspaces/nohoist section

```json
"nohoist": [
    "**/react-native",
    "**/react-native/**",
    "**/react-native-navigation",
    "**/react-native-navigation/**"
]
```

You can see this error in cli in this case

`ERROR Invariant Violation: No callback found with cbID...`
