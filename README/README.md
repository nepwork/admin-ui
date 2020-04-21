# CARE - COVID-19 App for Relief and Economic Security

This app is being developed by the covidsim.team for research, modeling and simulations for mitigation of COVID-19 spread in LDCs and EM/DEs.

You can find 
- the design details in REQUIREMENTS.md.
- steps for building for different platforms in BUILDING.md.
- contribution guidelines in CONTRIBUTING.md.

## Deploying

### Progressive Web App

1. Un-comment [these lines](https://github.com/ionic-team/ionic2-app-base/blob/master/src/index.html#L21)
2. Run `npm run ionic:build --prod`
3. Push the `www` folder to your hosting service

### Android

1. Run `ionic cordova run android --prod`

### iOS

1. Run `ionic cordova run ios --prod`
