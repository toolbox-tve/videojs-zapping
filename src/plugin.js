import videojs from 'video.js';
import {version as VERSION} from '../package.json';

import Carousel from './Carousel/Carousel';

import channels from './channels.json';

// Default options for the plugin.
const defaults = {
  liveProgressBar: true,
  channels: channels,
  defaultChannelId: '599c2cc301e490609d186d9b',
  button: false,
  externalApi: {
    url: "https://unity-cert.tbxapis.com/v0/contents/{contentId}/url?liveProgressBar={liveProgressBar}&network={network}",
    headers: {
      Accept: 'application/json',
      Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUb29sYm94IERpZ2l0YWwgU0EiLCJhdWQiOiJ1bml0eS1jZXJ0LnRieGFwaXMuY29tIiwiaWF0IjoxNTM3ODA0MTkwLCJleHAiOjE1Mzc5NzY5OTAsImNvdW50cnkiOiJQQSIsImxhbmd1YWdlIjoiZW4iLCJjbGllbnQiOiI5ODRiYTA3MWIwYjYyZjdlNDIzODNmNzhhMWUzNTBlNyIsImRldmljZSI6IjAzZDY5MGFlYjBiOTRiN2RmYzdmNGFlNjEwZTY3ZDQzYTdiNzFkNTAiLCJpbmRleCI6IjU4YmVhZDJiOTlhYzNiMmY4OTEzZTczYSIsImN1c3RvbWVyIjoiNTZhODFlYjE1MDY0ZDQxODA1YWZiOTljIiwibWF4UmF0aW5nIjo0LCJwcm9maWxlIjoiNTk2ZmU1YWIzNTQ3MTkyMDAwNTE0N2U5In0.OZceSOcJg1bn7oGDIzP9443mJZ0o--IZRTLl2WcDfic'
    },
    qs: { network: 'tbx' },
    body: {}
  }
};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-zapping');
  player.carousel = new Carousel(player, options);
  player.carousel.init();
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function zapping
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const zapping = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('zapping', zapping);

// Include the version number.
zapping.VERSION = VERSION;

export default zapping;
