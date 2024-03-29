'use strict';
import window from 'global/window';
import document from 'global/document';
import Flickity from 'flickity';
// import rp from 'request-promise';
class Carousel {
  constructor(player, options) {
    this.player = player;
    this.options = options;

    this.controlBarButton = document.createElement('div');
    this.controlBarButton.className = 'vjs-button vjs-control vjs-zapping-button icon-videojs-carousel-toggle vjs-hidden';
    if (options.button) {
      this.controlBarButton.classList.remove('vjs-hidden');
    }

    this.holderDiv = document.createElement('div');
    this.holderDiv.className = 'vjs-zapping-holder';


    this.viewport = document.createElement('div');
    this.viewport.className = 'vjs-zapping-viewport';

    this.flickity = null;
    this.channels = options && options.channels;
    this.isOpen = false;
  }

  init() {
    this.player.controlBar.el().appendChild(this.controlBarButton);
    this.player.el().appendChild(this.holderDiv);
    this.player.carousel.holderDiv.appendChild(this.viewport);
    this.player.carousel.buildCarousel();

    this.flickity = new Flickity('.vjs-zapping-viewport', { wrapAround: false, pageDots: false, imagesLoaded: true });

    // Find index of playing channel
    const selectIndex = this.options.channels.findIndex(channel => channel.id === this.options.defaultChannelId);

    this.flickity.select(selectIndex);

    this.setEventHandlers();
  }

  open() {
    // if casting a content disable zapping
    if (this.player.chromecast && this.player.chromecast.casting) {
      return;
    }

    if (!this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
      this.holderDiv.className = `${this.holderDiv.className} active`;
      this.isOpen = true;
    }
    this.flickity.resize();
  }

  close() {
    if (this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
        this.holderDiv.className = this.holderDiv.className.replace(/(?:^|\s)active(?!\S)/g, '');
        this.isOpen = false;
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  onButtonClick(e) {
    this.toggle();
    this.flickity.resize();
  }

  onChange(index) {
    // Keep the ui active
    this.isChanging = true;
    // console.log('onChange - active');

    // Abort other fetch
    if (this.abortController) {
      this.abortController.abort();
    }
    // New Abort controller
    this.abortController = new window.AbortController();

    const externalApi = this.options && this.options.externalApi;
    const networkData = this.channels[index].networks && this.channels[index].networks[0];
    const network = networkData && networkData.network;
    this.nextChannel = this.channels[index];
    const liveProgressBar = this.channels[index].hasCatchUp && this.options.liveProgressBar;
    const contentId = this.channels[index].id;
    const url = `${externalApi.url}/contents/${contentId}/url?liveProgressBar=${liveProgressBar}&network=${network}`;

    const options = {
      method: externalApi.method || 'GET',
      qs: externalApi.qs || null,
      // body: JSON.stringify(externalApi.body),
      headers: externalApi.headers,
      signal: this.abortController.signal
    }

    fetch(url, options)
      .then(result => {
        if (result.ok) {
          return result.json();
        }
        // TODO: throw error
        throw Error(`Zapping error ${result.error}`);
        // console.error(`vjs-zapping: ${JSON.stringify(error)}`);
      })
      .then(this.onFetchSuccess.bind(this))
      .catch(error => {
        window.videojs.log.error('Fetch: ', error);
      });
  }

  onFetchSuccess(response) {
    if(!response.content || !response.entitlements) {
      // TODO: throw error
      return;
    }

    const content = Object.assign({}, response.content);

    content.entitlements = [...response.entitlements];

    const playerConfig = TbxPlayer.PlayerBuilder._configData;

    playerConfig.element = TbxPlayer.PlayerBuilder._element;

    playerConfig.contentData = TbxPlayer.PlayerBuilder._contentData;

    content.country = playerConfig.contentData.country;
    this.player.poster(this.nextChannel.images[0].url);

    const instance = TbxPlayer.PlayerBuilder.init(playerConfig.element, content)
      .setPlayerConfig(playerConfig.player)
      .setTechsConfig(playerConfig.techs)
      .setPluginsConfig(playerConfig.plugins);

    instance.build();
  }

  onStaticClick(event, pointer, cellElement, cellIndex) {
    if (typeof cellIndex == 'number') {
      this.flickity.selectCell(cellIndex);
    }
  }

  onDragStart(event, pointer) {
    // console.log('dragStart');
    this.isDragging = true;
    this.player.userActive(true);
  }

  onDragEnd(event, pointer) {
    // console.log('dragEnd');
    this.player.userActive(true);
    this.isDragging = false;
    this.draggingEnded = true;
  }

  onUserInactive() {
    // console.log('userinactive');
    if (this.isDragging) {
      this.player.userActive(true);
    } else if (this.draggingEnded) {
      this.player.userActive(true);
      this.draggingEnded = false;
    } else if (this.isChanging) {
      this.player.userActive(true);
      this.isChanging = false;
    } else if (this.canClose) {
      this.canClose = false;
      this.close();
    } else if (!this.player.paused()) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = false;
      }

      this.timeoutId = setTimeout(() => {
        // console.log('timeout');
        this.canClose = true;
      }, 3000);
    }
  }

  onUserActive() {
    if (!this.isOpen) {
      this.flickity.resize();
      this.open();
    }
  }

  resize() {
    if (!this.isOpen){
      this.flickity.resize();
    }
  }

  firstOpen() {
    this.flickity.resize();
    setTimeout(this.open.bind(this), 1000);
  }

  setEventHandlers() {
    /* Flickity handlers */
    this.flickity.on('change', this.onChange.bind(this));
    this.flickity.on('staticClick', this.onStaticClick.bind(this));
    this.flickity.on('dragStart', this.onDragStart.bind(this));
    this.flickity.on('dragEnd', this.onDragEnd.bind(this));

    /* Videojs player handlers */
    this.player.on('userinactive', this.onUserInactive.bind(this));
    this.player.one('mouseover', this.firstOpen.bind(this));
    this.player.on('timeupdate', this.resize.bind(this));
    this.player.on('useractive', this.onUserActive.bind(this));
    this.player.on('startcast', this.close.bind(this));
    this.player.on('stopcast', this.open.bind(this));

    /* Button handlers */
    this.controlBarButton.onclick = this.onButtonClick.bind(this);
  }

  buildCarousel() {
    for (let i = 0; i < this.channels.length; i++) {
      const div = document.createElement('div');
      div.className = 'zapping-carousel-div';

      const img = document.createElement('img');
      const imgData = this.channels[i].images && this.channels[i].images[0];
      img.src = imgData && imgData.url;
      img.className = 'zapping-carousel-img';
      img.alt = this.channels[i].network && this.channels[i].network[0].network;

      // Title default[display: none]
      const text = document.createElement('p');
      text.className = 'zapping-carousel-p vjs-hidden';
      text.innerHTML = this.channels[i].title;

      // on image error hides image and shows title with videojs css class vjs-hidden
      img.onerror = () => {
        img.classList.add('vjs-hidden');
        text.classList.remove('vjs-hidden')
      }

      div.appendChild(img);
      div.appendChild(text);
      this.viewport.appendChild(div);
    }
  }

  initiateVideo(index, config, trigger) {
    if (config.callback !== undefined) {
      if (this.callbacksEnabled) {
        this.currentVideoIndex = index;
        config.callback(player, config, {
          trigger: trigger,
          newIndex: this.currentVideoIndex
        });
      }
    } else {
      this.currentVideoIndex = index;
      this.close();
      if (config.src !== undefined) {
        this.player.src(config.src);
        this.player.play();
      } else {
        window.location = config.url;
      }
    }
  }
};

export default Carousel;