# Mobile

## CI/CD for mobile

We use gitlab ci for running tests and bitrise for iOS/Android builds

Before your make the first build, please make sure that you've made the following changes:

-   Create group in gitlab for your projet (if not exists)
-   Create repository named `match`
-   Create repository named `frontend`
-   Specify settings in `mobile/fastlane/Appfile`
-   Specify bundle ids by changing default host software.beda.mobile to your domain

```
find ./ -type f -exec sed -i '' -e 's/software\.beda\.mobile/your_domain/' {} \;
```

-   In sentry create new project and create mobile app
-   In firebase create new project and add apps with bundle ids for `your_domain.mobile.android.develop`, `your_domain.mobile.android.staging` and `your_domain.mobile.android.production`. Download `google-services.json` and store it in **repository** in `android/app` directory. TODO: enable FCM on this step
-   In Apple developer console create three identifiers:
    -   `your_domain.mobile.ios.develop`
    -   `your_domain.mobile.ios.staging`
    -   `your_domain.mobile.ios.production`
-   Run `bundle exec fastlane match` in `mobile/` directory to initialize certificates, profiles and repository. Specify git url to `match` repository. Specify bundle ids from previous steps as a comma-separated list. **Note:** Remember password on this step for future CI/CD settings.
-   Generate release keystore for Android. https://developer.android.com/studio/publish/app-signing#generate-key Use `upload-key` as alias, and fill only the first name with something like CI. **Note:** Remeber key password, store password and key alias at this step. Don't add this file to the repository.
-   [Optional, it can be done after] Ask client to generate supply file using this link https://docs.fastlane.tools/actions/supply/#setup as instruction. It can do only Google Play console owner. As a result you should have JSON file. **Note:** Don't put it to the repository.

-   Generate sentry properties. You will be asked to authorize in sentry and choose sentry project. **Note:** this file is ignored in .gitignore, so you can easily delete it after you finish setup

```
npx @sentry/wizard -i reactNative -p ios android
```

-   Push repository to develop branch
-   Go to bitrise.com and login to your organization account
-   Add new project
-   Choose other
-   Add bitrise ssh key to deploy keys for `match` and this repository
-   Choose default branch develop
-   Wait until bitrise configure the project, it can fail with an error, just click **Ignore errors and proceed**
-   Choose `fastlane` as build configuration
-   Select fastlane lane `android develop` as example
-   Click confirm
-   Add icon or skip
-   Click the last button
-   This build will fail because we haven't added secrets and files
-   Click `frontend` at the breadcrumbs
-   Click settings
-   Change name from `frontend` to `mobile`
-   Click workflow, choose codesigning section and upload android `release.keystore` that you generated on previous steps. Specify key alias, store password and key password.
-   Upload `ios/sentry propertie`s file under `Generic file storage` section, use `SENTRY_PROPERTIES_URL` as Storage ID
-   Upload `supply.json` file under Generic file storage section, use `SUPPLY_JSON_KEY` as Storage ID.

-   In workflow, click secrets and add the following secrets:
    -   `FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD` - generate it in organization apple account (read https://support.apple.com/en-us/HT204397)
    -   `MATCH_PASSWORD` from the step about `fastlane match` command
    -   `FIREBASE_TOKEN` fetch it from running `firebase login:ci` on behalf your organization account
    -   `KEYCHAIN_PASSWORD` - any unique password (it is used only on CI for security purposes)

# Other helpers

To get fingerprint of android's keystores use:

Debug:

```
keytool -list -v -keystore debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Release:

```
keytool -list -v -keystore [keystore path] -alias [alias-name] -storepass [storepass] -keypass [keypass]
```
