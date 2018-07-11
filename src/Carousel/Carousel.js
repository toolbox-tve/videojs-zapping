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
    this.controlBarButton.className = 'vjs-button vjs-control vjs-zapping-button icon-videojs-carousel-toggle';

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

    this.flickity = new Flickity('.vjs-zapping-viewport', { wrapAround: false, pageDots: false });

    // Find index of playing channel
    const selectIndex = this.options.channels.findIndex(channel => channel.id === this.options.defaultChannelId);

    this.flickity.select(selectIndex);

    this.setEventHandlers();
  }

  open() {
    if (!this.isOpen) {
      if (!this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
        this.holderDiv.className = `${this.holderDiv.className} active`;
      }
    }
    this.isOpen = true;
  }

  close() {
    if (this.isOpen) {
      if (this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
        this.holderDiv.className = this.holderDiv.className.replace(/(?:^|\s)active(?!\S)/g, '');
      }
    }
    this.isOpen = false;
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
    // Abort other fetch
    if (this.abortController) {
      this.abortController.abort();
    }
    // New Abort controller
    this.abortController = new window.AbortController();

    const externalApi = this.options && this.options.externalApi;
    const networkData = this.channels[index].networks && this.channels[index].networks[0];
    const network = networkData && networkData.network;
    const url = externalApi.url
      .replace('{contentId}', this.channels[index].id)
      .replace('{network}', network);
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
    this.player.isDragging = true;
    this.player.userActive(true);
  }

  onDragEnd(event, pointer) {
    // console.log('dragEnd');
    this.player.userActive(true);
    this.player.isDragging = false;
    this.player.draggingEnded = true;
  }

  onUserInactive() {
    // console.log('userinactive');
    if (this.isDragging) {
      this.userActive(true);
    } else if (this.draggingEnded) {
      this.userActive(true);
      this.draggingEnded = false;
    }
  }

  setEventHandlers() {
    /* Flickity handlers */
    this.flickity.on('change', this.onChange.bind(this));
    this.flickity.on('staticClick', this.onStaticClick.bind(this));
    this.flickity.on('dragStart', this.onDragStart.bind(this));
    this.flickity.on('dragEnd', this.onDragEnd.bind(this));

    /* Videojs player handlers */
    this.player.on('userinactive', this.onUserInactive);

    /* Button handlers */
    this.controlBarButton.onclick = this.onButtonClick.bind(this);
  }

  buildCarousel() {
    for (let i = 0; i < this.channels.length; i++) {
      const div = document.createElement('div');
      div.className = 'carousel-div';

      const img = document.createElement('img');
      const imgData = this.channels[i].images && this.channels[i].images[0];
      img.src = imgData && imgData.url;
      img.className = 'carousel-img';
      img.alt = this.channels[i].network && this.channels[i].network[0].network;

      // Title default[display: none]
      const text = document.createElement('p');
      text.className = 'carousel-p vjs-hidden';
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