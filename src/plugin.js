import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import Carousel from './Carousel/Carousel';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  channels: [
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d8ca07f1c7532d9ba2410/a3cc470ab2370c88588204b1c85871d7/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    },
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d92bedec3be0bbaf48611/363b13cc8770e04416ee14f036af31eb/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    },
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/599d8f403e2b4832dfd32dc0/75b85d0359ecb0c5b3d7493e87c63d7f/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    },
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/59517e843e10381b468193a5/f535cac464dba6ee7dca8769c443b962/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    },
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/57246fb9ec2aee792b5aa69e/1d2c3bd30b67995a77bd584a69511568/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    },
    {
      id: '57ed60e975200c362ddf2184',
      imageSrc:
        'https://unity-img.tbxapis.com/v0/images/9d29a3723e9925c375478e2c88cac95f/content/58a1b01cd0cf3404bae6b273/c9053125991c2476a66dc3b840157905/img.png?crop=resizeScaleAndCrop&size=CGRID&_v=0.3.6&_s=200.114',
      url: 'https://vjs.zencdn.net/v/oceans.mp4',
      network: 'tbx'
    }
  ],
  externalApi: {
    url: "https://unity-dev.tbxapis.com/v0/contents/{contentId}/url?network={network}",
    headers: {
      Accept: 'application/json',
      Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUb29sYm94IERpZ2l0YWwgU0EiLCJhdWQiOiJ1bml0eS1kZXYudGJ4YXBpcy5jb20iLCJpYXQiOjE1Mjk0Mjk0NDIsImV4cCI6MTUyOTYwMjI0MiwiY291bnRyeSI6IkFSIiwibGFuZ3VhZ2UiOiJlbiIsImNsaWVudCI6IjE4MGRmZjBhZDBlZjRlMTJkZDJjZGIyOWU0NzM2MDY4IiwiZGV2aWNlIjoiN2U4MDdiYWM4NDJhYTQ3MDNiZTIyYjQwYmNiZGNjNzgzM2E4N2VlNiIsImluZGV4IjoiNTc1MTllNDJiY2FlYWVjMTJkNjI0NTUxIiwiY3VzdG9tZXIiOiI1N2YyYTVhZjBmODcyOTg1N2VlMDUxZjgifQ.bgeiIPFynKLXfzKlsb_nsrbHz_q8AtGNF1y3q7t5jkw'
    },
    qs: { network: 'tbx' },
    body: {}
  }
};

/**
 * An advanced Video.js plugin. For more information on the API
 *
 * See: https://blog.videojs.com/feature-spotlight-advanced-plugins/
 */
class Zapping extends Plugin {

  /**
   * Create a Zapping plugin instance.
   *
   * @param  {Player} player
   *         A Video.js Player instance.
   *
   * @param  {Object} [options]
   *         An optional options object.
   *
   *         While not a core part of the Video.js plugin architecture, a
   *         second argument of options is a convenient way to accept inputs
   *         from your plugin's caller.
   */
  constructor(player, options) {
    // the parent class will add player under this.player
    super(player);

    this.options = videojs.mergeOptions(defaults, options);

    this.player.ready(() => {
      this.player.addClass('vjs-zapping');
      player.carousel = new Carousel(this.player, this.options);
      player.carousel.init();
    });
  }
}

// Define default values for the plugin's `state` object here.
Zapping.defaultState = {};

// Include the version number.
Zapping.VERSION = VERSION;

// Register the plugin with video.js.
videojs.registerPlugin('zapping', Zapping);

export default Zapping;
