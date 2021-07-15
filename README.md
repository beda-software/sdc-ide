## SDC IDE

Reactive IDE for [SDC](http://hl7.org/fhir/uv/sdc/2019May/)

Live demo http://sdc.beda.software/.  
Devdays speach about SDC and SDC IDE https://www.youtube.com/watch?v=6zzpfb7az_c.  

### local launch
To check the app please go to [examples](examples) folder and follow readme.  
Mobile questionnaire tester app is WIP.   
Exteranl plugable rendering is WIP.   

## Development mode

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
