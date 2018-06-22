'use strict';
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
    this.setEventHandlers();
  }

  open() {
    if (!this.isOpen) {
      if (!this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
        this.holderDiv.className = this.holderDiv.className + " active";
      }
    }
    this.isOpen = true;
  }

  close() {
    if (this.isOpen) {
      if (this.holderDiv.className.match(/(?:^|\s)active(?!\S)/g)) {
        this.holderDiv.className = this.holderDiv.className.replace(/(?:^|\s)active(?!\S)/g, '')
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
    console.log(`Changed index to ${index}`);
    const externalApi = this.options && this.options.externalApi;
    const url = externalApi.url
      .replace('{contentId}', this.channels[index].id)
      .replace('{network}', this.channels[index].network);
    const options = {
      method: externalApi.method || 'GET',
      qs: externalApi.qs || null,
      // body: JSON.stringify(externalApi.body),
      headers: externalApi.headers,
      json: true
    }

    fetch(url, options)
      .then(result => {
        if (result.ok) {
          return result.json();
        }
        // console.error(`vjs-zapping: ${JSON.stringify(error)}`);
      })
      .then(this.onFetchSuccess.bind(this));
  }

  onFetchSuccess(response) {
    this.player.src(response);
  }

  onStaticClick(event, pointer, cellElement, cellIndex) {
    if (typeof cellIndex == 'number') {
      this.flickity.selectCell(cellIndex);
    }
  }

  onDragStart(event, pointer) {
    console.log('dragStart');
    this.player.isDragging = true;
    this.player.userActive(true);
  }

  onDragEnd(event, pointer) {
    console.log('dragEnd');
    this.player.userActive(true);
    this.player.isDragging = false;
    this.player.draggingEnded = true;
  }

  onUserInactive() {
    console.log('userinactive');
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
      let img = document.createElement('img');
      img.src = this.channels[i].imageSrc;
      img.className = 'carousel-img';
      img.alt = this.channels[i].network;

      this.viewport.appendChild(img);
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