import injectTapEventPlugin from 'react-tap-event-plugin';

if (!global.injectTapEventPluginReady) {
  injectTapEventPlugin();
  global.injectTapEventPluginReady = true;
}
