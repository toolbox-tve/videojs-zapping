import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import Carousel from './Carousel/Carousel';

import channels from './channels.json';

const Plugin = videojs.getPlugin('plugin');

// Default options for the plugin.
const defaults = {
  channels: channels,
  defaultChannelId: '5b295933adcc7d4d15ec9e5f',
  button: false,
  externalApi: {
    url: "https://unity-dev.tbxapis.com/v0/contents/{contentId}/url?network={network}",
    headers: {
      Accept: 'application/json',
      Authorization: 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUb29sYm94IERpZ2l0YWwgU0EiLCJhdWQiOiJ1bml0eS1kZXYudGJ4YXBpcy5jb20iLCJpYXQiOjE1MzIxMTA5MzgsImV4cCI6MTUzMjI4MzczOCwiY291bnRyeSI6IkFSIiwibGFuZ3VhZ2UiOiJlbiIsImNsaWVudCI6IjE4MGRmZjBhZDBlZjRlMTJkZDJjZGIyOWU0NzM2MDY4IiwiZGV2aWNlIjoiM2NlY2MyZTgyODBiMDM3ODAyNmUxOTI2NWFhMDc0NTFhYWEzZjYzMyIsImluZGV4IjoiNTc1MTllNDJiY2FlYWVjMTJkNjI0NTUxIiwiY3VzdG9tZXIiOiI1N2YyYTVhZjBmODcyOTg1N2VlMDUxZjgiLCJtYXhSYXRpbmciOjQsInByb2ZpbGUiOiI1OGMwNjlkMmM3NmJjNDIwMDBiMTQ4YjIifQ.Mj9EDcKz3xCk9UsWwtmsD0jw1LLh6hh5mBmPDCY7prM'
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
