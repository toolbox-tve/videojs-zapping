'use strict';
import Flickity from 'flickity';

class Carousel {
  constructor(player, options) {
    this.player = player;

    this.controlBarButton = document.createElement('div');
    this.controlBarButton.className = 'vjs-button vjs-control vjs-related-carousel-button icon-videojs-carousel-toggle';

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
    player.src({
      src: 'https://d11gqohmu80ljn.cloudfront.net/637/384415_19d188634f44db3147cbab020fc3c19c/mpds/384415.mpd?cb=1473777901',
      type: 'application/dash+xml',
      keySystemOptions: [
        {
          name: 'com.widevine.alpha',
          options: {
            serverURL: 'https://proxy-dev.tbxdrm.com/v1/drm-proxy/widevine/modular/tbxnet?contentId=aa07f498-c27d-4ae2-ad02-5c2518504cfa'
          }
        }
      ]
    });
    player.play();
  }

  onStaticClick( event, pointer, cellElement, cellIndex ) {
    if ( typeof cellIndex == 'number' ) {
      this.flickity.selectCell( cellIndex );
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
        player.src(config.src);
        player.play();
      } else {
        window.location = config.url;
      }
    }
  }
};

export default Carousel;