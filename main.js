const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");
const listSongs = $$(".song");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Faded",
      singer: "Alan Walker",
      path: "./music/song0.mp3",
      image: "./image/image0.jpg",
    },
    {
      name: "Radioactive",
      singer: "Imagine Dragons",
      path: "./music/song2.mp3",
      image: "./image/image2.jpg",
    },
    {
      name: "Spectre",
      singer: "Alan Walker",
      path: "./music/song3.mp3",
      image: "./image/image3.jpg",
    },
    {
      name: "Basta Boi Remix",
      singer: "Alfons",
      path: "./music/song4.mp3",
      image: "./image/image4.jpg",
    },
    {
      name: "Havana",
      singer: "Camila Cabello",
      path: "./music/song5.mp3",
      image: "./image/image5.jpg",
    },
    {
      name: "Memories",
      singer: "Maroon 5",
      path: "./music/song6.mp3",
      image: "./image/image6.jpg",
    },
    {
      name: "Bones",
      singer: "Imagine Dragons",
      path: "./music/song7.mp3",
      image: "./image/image7.jpg",
    },
    {
      name: "Demons",
      singer: "Imagine Dragons",
      path: "./music/song8.mp3",
      image: "./image/image8.jpg",
    },
    {
      name: "Natural",
      singer: "Imagine Dragons",
      path: "./music/song9.mp3",
      image: "./image/image9.jpg",
    },
    {
      name: "Whatever it takes",
      singer: "Imagine Dragons",
      path: "./music/song10.mp3",
      image: "./image/image10.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
        <div
          class="thumb"
          style="
            background-image: url('${song.image}');
          "
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });
    playList.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handlerEvents: function () {
    const cdWidth = cd.offsetWidth;

    //xử lí CD quay
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });

    cdThumbAnimate.pause();

    // xử lí phóng to thu nhỏ đĩa than
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // xử lí khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi song đc play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // khi song bị pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    // Xử lí khi tua song
    progress.oninput = function (e) {
      const seekTime = (audio.duration * e.target.value) / 100;
      audio.currentTime = seekTime;
    };

    //next Song
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      app.render();
      app.scrollActiveSong();
      if ($(".song.active").offsetTop <= 203) {
        window.scrollTo({ top: 408 + "px", behavior: "smooth" });
      }
    };

    //lùi lại/prev Song
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.scrollActiveSong();
      app.render();
      if ($(".song.active").offsetTop <= 203) {
        window.scrollTo({ top: 408 + "px", behavior: "smooth" });
      }
    };

    //random Song
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom;
      randomBtn.classList.toggle("active", app.isRandom);
    };

    // xử lí lặp lại song
    repeatBtn.onclick = function (e) {
      app.isRepeat = !app.isRepeat;
      repeatBtn.classList.toggle("active", app.isRepeat);
    };

    //Xử lí song khi audio ended
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    const playListPlay = $$(".song");
    playListPlay.forEach((song, index) => {
      song.onclick = function (e) {
        app.currentIndex = Number(this.id);
        app.loadCurrentSong();
        audio.play();
        app.makeBtnPlays();
      };
    });

    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index);
          app.loadCurrentSong();
          audio.play();
          app.render();
          if ($(".song.active").offsetTop <= 203) {
            window.scrollTo({ top: 408 + "px", behavior: "smooth" });
          }
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },

  scrollActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  makeBtnPlays: function () {
    const menuListSong = $$(".song");
    menuListSong.forEach((song, index) => {
      this.currentIndex === index
        ? song.classList.add("active")
        : song.classList.remove("active");
    });
  },

  start: function () {
    //Định nghĩa thuộc tính Ojbect
    this.defineProperties();

    //Lắng nghe/ xử lí các sự kiện( DOM event)
    this.handlerEvents();

    //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    //render playlist
    this.render();
  },
};

app.start();
