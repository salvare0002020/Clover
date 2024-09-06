const apiUrl = "https://deckofcardsapi.com/api/";
//共通処理用変数
let cardNumber = 0;
//座標別判定用
let x1y1 = Boolean(false);
let x1y2 = Boolean(false);
let x1y3 = Boolean(false);
let x1y4 = Boolean(false);
let x2y1 = Boolean(false);
let x2y2 = Boolean(false);
let x2y3 = Boolean(false);
let x2y4 = Boolean(false);
let x3y1 = Boolean(false);
let x3y2 = Boolean(false);
let x3y3 = Boolean(false);
let x3y4 = Boolean(false);
let x4y1 = Boolean(false);
let x4y2 = Boolean(false);
let x4y3 = Boolean(false);
let x4y4 = Boolean(false);

//カード別判定用
let JACK = Boolean(false);
let QUEEN = Boolean(false);
let KING = Boolean(false);

//ウィンドウ読み込み時function onLoad()実行
document.addEventListener('DOMContentLoaded', function() {
  setUp();
});

//ボタンをクリックした際に初期セットアップ実行
let bolCreateDeck = Boolean (false);
document.getElementById("get").addEventListener("click", async () => {
  console.log(bolCreateDeck);
  if(bolCreateDeck == false){
    setUp();
  }
});

//カードをクリックした際に処理を実行
function selectCard(divId) {
  console.log(divId + " : cardをクリックしました");
  
  // カードの座標を取得
  let cardXY = document.getElementById(divId);
  
  // カードの値を取得
    //cardXYの子要素のなかからimgタグを指定
  let cardElement = cardXY.getElementsByTagName("img")[0];
    //cardElementのクラスの一番最後を取得
  let cardValue = cardElement.className.split(" ").pop();
  
  console.log("Card Value: " + cardValue);

  //カードの処理を行う
  calValue(cardValue);
}
//初期セットアップ用関数
function setUp(){
  // 関数を実行
  name();

  //関数"name"の定義
  let response;
  let deck;
  let deckId;
  console.log("setUp実行");

  async function name(params) {
    response = await fetch(apiUrl + "deck/new/shuffle/?deck_count=1");
    deck = await response.json();
    console.log(deck);
    deckId = deck.deck_id;
    console.log(deckId);
    bolCreateDeck = true;
    console.log(bolCreateDeck);
    
    // カード16枚ドロー
    let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=16");
    const card = await draw1.json();
    let createAria;
    for(let i = 0; i < 4; i++){
      for(let x = 0; x < 4; x++){
        let y = i * 4 + x;
        const cardImg = card.cards[y].image;
        const cardSuit = card.cards[y].suit;
        const cardValue = card.cards[y].value;

        const image = document.createElement("img");
        image.src = cardImg;
        image.className = cardSuit + " " + "card" + " " + cardValue;
        
        console.log(y + 1);
        createAria = document.getElementById(y + 1);
        createAria.appendChild(image);
      }
      bolCreateDeck = true;
      console.log(bolCreateDeck); 
    }
  }
}

function calValue(cardValue){
  console.log("calValue実行開始 : " + cardValue);
  if(cardValue == "2" ||cardValue == "3" ||cardValue == "4" ||cardValue == "5" ||cardValue == "6" ||cardValue == "7" ||cardValue == "8" ||cardValue == "9"){
    let number = Number(cardValue);
    cardNumber += number;
  }else if(cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING"){
    if(cardValue == "JACK"){
      JACK = true;
      console.log("JACK : " + JACK);
    }else if(cardValue == "QUEEN"){
      QUEEN = true;
      console.log("QUEEN : " + QUEEN);
    }else{
      KING = true;
      console.log("KING : " + KING);
    }
  }else if(cardValue == "ACE"){
    cardNumber += 1;
  }
  console.log(cardNumber);
}
