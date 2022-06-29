'use strict';
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = 'MY_MUSIC_PLAYER';

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // Use localStorage
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: 'Treat Me Right',
      singer: 'ElloXo',
      path: './assets/audio/01_Treat-Me-Right.wav',
      image: './assets/art/Art-Track-1.png',
    },
    {
      name: 'Look Away',
      singer: 'ElloXo',
      path: './assets/audio/02_Look-Away.wav',
      image: './assets/art/Art-Track-2.png',
    },
    {
      name: 'Feel The Love',
      singer: 'ElloXo',
      path: './assets/audio/03_Feel-The-Love.wav',
      image: './assets/art/Art-Track-3.png',
    },
    {
      name: 'By Your Side',
      singer: 'ElloXo',
      path: './assets/audio/04_By-Your-Side.wav',
      image: './assets/art/Art-Track-4.png',
    },
    {
      name: 'C\'est La Vie',
      singer: 'ElloXo',
      path: './assets/audio/05_Cest-La-Vie.wav',
      image: './assets/art/Art-Track-5.png',
    },
    {
      name: 'Together',
      singer: 'ElloXo',
      path: './assets/audio/06_Together.wav',
      image: './assets/art/Art-Track-6.png',
    },
    {
      name: 'Feelings',
      singer: 'ElloXo',
      path: './assets/audio/07_Feelings.wav',
      image: './assets/art/Art-Track-7.png',
    },
    {
      name: 'With You',
      singer: 'ElloXo',
      path: './assets/audio/08_With-You.wav',
      image: './assets/art/Art-Track-8.png',
    },
    {
      name: 'Find Our Way',
      singer: 'ElloXo',
      path: './assets/audio/09_Find-Our-Way.wav',
      image: './assets/art/Art-Track-9.png',
    },
    {
      name: 'Moonlight',
      singer: 'ElloXo',
      path: './assets/audio/10_Moonlight.wav',
      image: './assets/art/Art-Track-10.png',
    },
  ],
  setConfig(key, value) {
    this.config[key] = value;
    // Use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render() {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? 'active' : ''
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join('');
  },
  defineProperties() {
    Object.defineProperty(this, 'currentSong', {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
      duration: 10000, // 10 seconds
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Handle when play button is clicked
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add('playing');
      cdThumbAnimate.play();
    };

    // When the song is paused
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove('playing');
      cdThumbAnimate.pause();
    };

    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Handling seek
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Handling on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig('isRandom', _this.isRandom);
      randomBtn.classList.toggle('active', _this.isRandom);
    };

    // Single-parallel repeat processing
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig('isRepeat', _this.isRepeat);
      repeatBtn.classList.toggle('active', _this.isRepeat);
    };

    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Listen to playlist clicks (this is not used in this version)
    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)');

      if (songNode || e.target.closest('.option')) {
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Handle when clicking on the song option
        if (e.target.closest('.option')) {
        }
      }
    };
  },
  scrollToActiveSong() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }, 300);
  },
  loadCurrentSong() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig() {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong() {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong() {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start() {
    // Assign configuration from config to application
    this.loadConfig();

    // Defines properties for the object
    this.defineProperties();

    // Listening / handling events (DOM events)
    this.handleEvents();

    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle('active', this.isRandom);
    repeatBtn.classList.toggle('active', this.isRepeat);
  },
};

app.start();
