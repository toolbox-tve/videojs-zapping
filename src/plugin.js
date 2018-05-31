import videojs from 'video.js';
import { version as VERSION } from '../package.json';
import Carousel from './carousel';

// Default options for the plugin.
const defaults = {
  channels: [
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d8ca07f1c7532d9ba2410/a3cc470ab2370c88588204b1c85871d7/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    },
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d92bedec3be0bbaf48611/363b13cc8770e04416ee14f036af31eb/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    },
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d8f403e2b4832dfd32dc0/75b85d0359ecb0c5b3d7493e87c63d7f/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    },
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/59517e843e10381b468193a5/f535cac464dba6ee7dca8769c443b962/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    },
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/57246fb9ec2aee792b5aa69e/1d2c3bd30b67995a77bd584a69511568/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    },
    {
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/58a1b01cd0cf3404bae6b273/c9053125991c2476a66dc3b840157905/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'video 1 network'
    }
  ]
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
