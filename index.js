const spinMachine = document.getElementById('spinMachine');
const image = document.getElementsByTagName('img');
const message = document.getElementById('message');
const bankField = document.getElementById('bank');
const bet = document.getElementById('bet');
const spin = document.getElementById('spin');
const twitter = document.getElementById('twitter');

const slots = [
  'assets/img/0.png',
  'assets/img/1.png',
  'assets/img/2.png',
  'assets/img/3.png',
  'assets/img/4.png',
];

function sleep(msec) {
  return new Promise(function(resolve) {

     setTimeout(function() {resolve()}, msec);

  })
}

class Casino {
  constructor(params) {
    this.spinMachine = params.spinMachine;
    this.image = params.image;
    this.message = params.message;
    this.bankField = params.bankField;
    this.bet = params.bet;
    this.spin = params.spin;
    this.twitter = params.twitter;
    this.spin.disabled = true;
    this.slots = params.slots;
    this.betValue = [];
    this.bank = 500;
    this.bankField.innerText = this.bank;
  }

  async getBet() {
    this.betValue.unshift(this.bet.value);
  }

  async checkInput() {
    this.bet.addEventListener('input', () => {
      if (this.bet.value > 0 ) {
        this.spin.disabled = false;
        this.message.innerText = '';
      }

      if (this.bet.value <= 0) {
        this.spin.disabled = true;
        this.message.innerText = 'ゼロよりも大きい金額を入力してください';
      }

      if (this.bet.value > this.bank){
        this.spin.disabled = true;
        this.message.innerText = '所持ろっぷが足りません';        
      }

      if (this.bank == 0 ){
        this.spin.disabled = true;
        this.message.innerText = '所持ろっぷがありません';        
      }
    });
  }

  async startShuffle() {
    for (let i = 0; i < 3; i += 1) {
      const shuffle = this.slots[Math.floor(Math.random() * this.slots.length)];
      this.image[i].src = shuffle;
      this.checkMatch(this.image[i]);
      this.image[i].classList.add('picture');
      await sleep(500);
    }
  }

  async checkMatch(pic) {
    const elem = this.spinMachine.children;
    for (let i = 0; i < elem.length - 1; i += 1) {
      console.log(pic.src)
      console.log(elem[i].src )
      if (pic.src === elem[i].src && pic !== elem[i]) {
        this.matches += 1;
      }
    }
  }

  async changeBank() {
    const amount = Number(this.bank);
    const bit = Number(this.betValue[0]);

    if ( this.matches >= 3 ) {
      this.bank = amount + bit * 100
      this.message.innerText = '大当たり！';
    } else {
      this.bank = amount - bit 
    }
    this.bankField.innerText = this.bank;
  }

  async clearInput() {
    this.bet.value = '';
  }

  async clearStyle() {
    for (let i = 0; i < 3; i += 1) {
      this.image[i].classList.remove('picture')
      this.image[i].src = ""
    }
    this.spin.disabled = true;
  }

  shareTwitter(){
    let tweet
    if (this.bank == 0){
      tweet = "https://twitter.com/intent/tweet?text=Casino AirInterop で全ろっぷを失いました・・・ https:\/\/www.airinterop.jp&hashtags=airinterop"
    } else {
      tweet = "https://twitter.com/intent/tweet?text=Casino AirInterop で" + this.bank +"ろっぷを稼ぎました！ https:\/\/www.airinterop.jp&hashtags=airinterop"
    }

    window.open(tweet);
  }

  getStart() {
    this.spin.addEventListener('click', async () => {
      await this.clearStyle();
      this.matches = 0;
      await this.getBet();
      await this.startShuffle();
      await this.changeBank();
      await this.clearInput();
    });
    this.checkInput();
    this.twitter.addEventListener('click', () => {
      this.shareTwitter();
    });
  }
}

const game = new Casino({
  spinMachine,
  spin,
  slots,
  message,
  bankField,
  bet,
  image,
  twitter,
});

game.getStart();
