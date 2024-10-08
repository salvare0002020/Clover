const apiUrl = "https://deckofcardsapi.com/api/";
//共通処理用変数
let deckId;
let cardNumber = 0;
let deckCount = 48;
let deck =deckCount-16;
let deforCalNumber;
let isDeckZero = Boolean(false);
let backCard =0;
let imgElements;
//座標別判定用
  //true格納用配列
  let changedPoints =[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]];
//   let changedPoints =[[false,false,false,false,false,false,false,false,false,false,false,false]
//   ,[false,false,false,false,false,false,false,false,false,false,false,false]
//   ,[false,false,false,false,false,false,false,false,false,false,false,false]
// ];
  // 選択状態のカードの座標
  let truePointsX = [];
  let truePointsY = [];
  let imgID = [];
//クリック済みの種類判別用
  //マーク判別用
    //null → 未選択状態
    //number →　１～９のカードのみ選択中
    //String →　JACK,QUEEN,KINGのカードのみ選択中
let selectedCardSuit;
  //1~9 or other判別用
let selectedCardType;
  //選択済み状態のカードの数
let countSelectedCard =0;
//JACK , QUEEN , KINGの枚数
let countSelectedString=0;
let deletedCards = [];
//カード別判定用
  //直前にクリックしたカードの種類
let cardType;
  //特定のカード選択状況
let JACK = Boolean(false);
let QUEEN = Boolean(false);
let KING = Boolean(false);

//ウィンドウ読み込み時function onLoad()実行
document.addEventListener('DOMContentLoaded', function() {
  setUp();
  setHeight();
});

//ボタンをクリックした際にニューゲーム実行
let bolCreateDeck = Boolean (false);
document.getElementById("get").addEventListener("click", async () => {
  if(bolCreateDeck == false){
    setUp();
  }else{
    response = await fetch(apiUrl + "deck/new/shuffle/?cards=AS,2S,3S,4S,5S,6S,7S,8S,9S,JS,QS,KS,AD,2D,3D,4D,5D,6D,7D,8D,9D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,8C,9C,JC,QC,KC,AH,2H,3H,4H,5H,6H,7H,8H,9H,JH,QH,KH");
    deck = await response.json();
    deckId = deck.deck_id;
    console.log(deckId);
    bolCreateDeck = true;
    
    // カード16枚ドロー
    let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=16");
    // let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=48");
    const card = await draw1.json();
    let createAria;
    for(let i = 0; i < 16; i++){
        const cardImg = card.cards[i].image;
        const cardSuit = card.cards[i].suit;
        const cardValue = card.cards[i].value;

        
        let imgID = document.getElementById(i+1);
        let img = imgID.getElementsByTagName("img")[0];
        img.src=cardImg;
        img.className = cardSuit + " " + "card" + " " + cardValue;
      }
      bolCreateDeck = true;
    }
    location.reload();
});

//カードをクリックした際に複数処理を実行
function selectCard(divId) {
  // カードの座標を取得
  let cardXY = document.getElementById(divId);

  // カードの値を取得
    //cardXYの子要素のなかからimgタグを指定
  let cardElement = cardXY.getElementsByTagName("img")[0];
    //カードの値を取得 : cardElementのクラスの一番最後を取得
  let cardValue = cardElement.className.split(" ").pop();
  //カードのマークを取得
  let cardSuit = cardElement.className.split(" ")[0];
  
  //cardXYからクリックした座標が計算対象とみなされるか判定＆計算対象としてみなされる場合trueまたはfalseを代入
  markedPoints(divId,cardSuit,cardValue);

  //カードの処理を行う
  calValue(divId,cardValue,cardSuit);
}

//初期セットアップ用関数
function setUp(){
  // 関数を実行
  name();

  //関数"name"の定義
  let response;
  let deck;

  async function name(params) {
    response = await fetch(apiUrl + "deck/new/shuffle/?cards=AS,2S,3S,4S,5S,6S,7S,8S,9S,JS,QS,KS,AD,2D,3D,4D,5D,6D,7D,8D,9D,JD,QD,KD,AC,2C,3C,4C,5C,6C,7C,8C,9C,JC,QC,KC,AH,2H,3H,4H,5H,6H,7H,8H,9H,JH,QH,KH");
    deck = await response.json();
    deckId = deck.deck_id;
    console.log(deckId);
    bolCreateDeck = true;
    
    // カード16枚ドロー
    let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=16");
    // let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=48");
    const card = await draw1.json();
    let createAria;
    for(let i = 0; i < 16; i++){
        const cardImg = card.cards[i].image;
        const cardSuit = card.cards[i].suit;
        const cardValue = card.cards[i].value;

        const image = document.createElement("img");
        image.src = cardImg;
        image.className = cardSuit + " " + "card" + " " + cardValue;
        
        createAria = document.getElementById(i + 1);
        createAria.appendChild(image);
      }
      bolCreateDeck = true;
  }
}

//完成済み
//selectCard()から呼び出し : 計算処理を行う
function calValue(divId,cardValue,cardSuit){
  //直前にクリックした画像の座標を取得
  let xy = Number(divId);

  let clickingX = xy % 4;
  let clickingY = Math.ceil(xy / 4)-1;
  if(clickingX == 0){
    clickingX = 4;
  }
  clickingX -= 1;
  if(changedPoints[clickingX][clickingY] == true){
    //選択状態のとき
    if(cardValue == "2" ||cardValue == "3" ||cardValue == "4" ||cardValue == "5" ||cardValue == "6" ||cardValue == "7" ||cardValue == "8" ||cardValue == "9" ||cardValue == "10"){
      let number = Number(cardValue);
      cardNumber += number;
    }else if(cardValue == "ACE"){
      cardNumber += 1;
    }
  
    if(cardNumber == 0){
      if(cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING"){
        if(cardValue == "JACK"){
          JACK = true;
        }else if(cardValue == "QUEEN"){
          QUEEN = true;
        }else{
          KING = true;
        }
      }
    }
  }else{
    //選択状態じゃないとき
    if(cardValue == "2" ||cardValue == "3" ||cardValue == "4" ||cardValue == "5" ||cardValue == "6" ||cardValue == "7" ||cardValue == "8" ||cardValue == "9" ||cardValue == "10"){
      let number = Number(cardValue);
      if(selectedCardSuit == cardSuit && deforCalNumber <= 15){
        cardNumber -= number;
      }
    }else if(cardValue == "ACE" && cardNumber !=0){
      cardNumber -= 1;
    }
  
    if(cardNumber == 0){
      if(cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING"){
        if(cardValue == "JACK"){
          JACK = false;
        }else if(cardValue == "QUEEN"){
          QUEEN = false;
        }else{
          KING = false;
        }
      }
    }
  }

  console.log("JACK : "+JACK + " QUEEN : "+QUEEN+" KING : "+KING);
  console.log("選択済みの数値の合計 : "+cardNumber);

  if(cardNumber == 15 || JACK == true && QUEEN == true && KING == true){
    console.log("削除実行");  
    deleteCard();
  }
}

//完成済み
//selectCard()から呼び出し : 選択状態かどうかの判定と選択状態,非選択状態の入れ替えを行う
function markedPoints(divId, cardSuit, cardValue) {
  // 座標の調節
  let xy = Number(divId);
  let clickingX = (xy % 4 === 0 ? 4 : xy % 4) - 1;
  let clickingY = Math.ceil(xy / 4) - 1;

  console.log(`clickingX: ${clickingX}, clickingY: ${clickingY}`);

  const inputClass = document.getElementById(divId); // DOM要素を1回取得

  // マークとカードタイプの初期化
  if (selectedCardSuit == null) selectedCardSuit = cardSuit;

  if (selectedCardType == null) {
    if (["ACE", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"].includes(cardValue)) {
      selectedCardType = "number";
      if (cardValue === "ACE") cardValue = 1;
    } else {
      selectedCardType = "String";
    }
  }

  console.log(`selectedCardType: ${selectedCardType}, cardValue: ${cardValue}`);

  // 直前にクリックしたカードの種類と値の計算
  let cardType = selectedCardType;
  let deforCalNumber = Number(cardNumber) + Number(cardValue === "ACE" ? 1 : cardValue);

  if (cardType === selectedCardType && selectedCardSuit === cardSuit) {
    const isSelected = changedPoints[clickingX][clickingY];
    const isNumberType = cardType === "number";
    const canSelectNumber = isNumberType && deforCalNumber <= 15;

    if (!isSelected && (canSelectNumber || cardType === "String")) {
      // カードを選択する処理
      updateCardSelection(divId, clickingX, clickingY, true);
      inputClass.className = "clicked";
      if (cardType === "String") countSelectedString++;
    } else if (isSelected && (canSelectNumber || cardType === "String")) {
      // カードの選択解除処理
      updateCardSelection(divId, clickingX, clickingY, false);
      inputClass.className = "nonClicked";
      if (cardType === "String") countSelectedString--;
    } else {
      // 値が15以上のためスキップ
      console.log("値が15以上のためスキップ");
      inputClass.className = "nonClicked";
    }
  }

  // 選択済みカードがない場合のリセット処理
  if (countSelectedCard === 0) {
    selectedCardType = null;
    selectedCardSuit = null;
    cardNumber = 0;
  }
}

function updateCardSelection(divId, clickingX, clickingY, isSelected) {
  changedPoints[clickingX][clickingY] = isSelected;
  console.log(`changedPoints[${clickingX}][${clickingY}]: ${isSelected}`);
  
  if (isSelected) {
    imgID.push(divId);
    truePointsX.push(clickingX);
    truePointsY.push(clickingY);
    countSelectedCard++;
  } else {
    imgID.pop(divId);
    truePointsX.pop(clickingX);
    truePointsY.pop(clickingY);
    countSelectedCard--;
  }
}


async function deleteCard() {
  let card;
  const reInputIMGs = imgID.map(id => document.getElementById(id));

  deckCount -= countSelectedCard;
  deck = Math.max(0, deck - countSelectedCard); // デッキが負の値にならないように調整
  console.log("countSelectedCard: " + countSelectedCard + " deck: " + deck + " deckCount: " + deckCount);

  try {
    // 選択された枚数のカードをデッキからドローする処理
    const fetchCount = Math.min(countSelectedCard, deck);
    const reDraw = await fetch(`${apiUrl}deck/${deckId}/draw/?count=${fetchCount}`);
    card = await reDraw.json();

    if (card && card.success && card.cards && card.cards.length > 0) {
      updateCardImages(card.cards, fetchCount);
    } else {
      handleNoCards(reInputIMGs);
    }

    if (countSelectedCard > deck) {
      //選択した数よりデッキが少ない
      handleExtraCards(deck, reInputIMGs);
    }
  } catch (error) {
    console.error("カードのフェッチや処理中にエラーが発生しました:", error);
    handleNoCards(reInputIMGs);
  }

  updateDeletedCards();
  updateDeckCountDisplay();

  if (deckCount === 0) {
    console.log("クリア！");
  }

  resetCount();
}

function updateCardImages(cards, fetchCount) {
  for (let x = 0; x < fetchCount; x++) {
    const cardImg = cards[x].image;
    const cardSuit = cards[x].suit;
    const cardValue = cards[x].value;

    console.log(`cardImg: ${cardImg}, cardSuit: ${cardSuit}, cardValue: ${cardValue}`);
    
    const reInputIMG = document.getElementById(imgID[x]);
    if (reInputIMG) {
      let imgElement = reInputIMG.getElementsByTagName("img")[0];
      deletedCards.push(imgElement.src);
      imgElement.src = cardImg;
      imgElement.className = `${cardSuit} card ${cardValue}`;
    } else {
      console.error(`ID ${imgID[x]} の要素が見つかりませんでした。`);
    }
  }
}

function handleNoCards(reInputIMGs) {
  reInputIMGs.forEach(imgElement => {
    imgElement.getElementsByTagName("img")[0].src = "https://deckofcardsapi.com/static/img/back.png";
    imgElement.className = "none";
  });
}

function handleExtraCards(backCardCount, reInputIMGs) {
  for (let x = 0; x < backCardCount; x++) {
    reInputIMGs[x].getElementsByTagName("img")[0].src = "https://deckofcardsapi.com/static/img/back.png";
    reInputIMGs[x].className = "none";
  }
}

function updateDeletedCards() {
  const inputDeletedCards = document.getElementById("getTrump");
  if (inputDeletedCards) {
    let imgElements = inputDeletedCards.getElementsByTagName("img");
    while (imgElements.length > 0) {
      imgElements[0].remove();
    }

    deletedCards.forEach(src => {
      const image = document.createElement("img");
      image.src = src;
      inputDeletedCards.appendChild(image);
    });
  } else {
    console.error('Element with id "getTrump" が見つかりませんでした。');
  }
}

function updateDeckCountDisplay() {
  const deckInfo = document.getElementById("deckInfo");
  if (deckInfo) {
    deckInfo.textContent = `残り枚数 : ${deck}枚`;
  }
}


function resetCount(){
  console.log("カウントリセット開始");
  // 判定のリセット
  selectedCardType = null;
  selectedCardSuit = null;
  cardNumber = 0;
  JACK = false;
  QUEEN = false;
  KING = false;
  imgID = [];
  truePointsX = [];
  truePointsY = [];
  changedPoints =[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]];
  deforCalNumber = 0;
  countSelectedCard = 0;
  deletedCards = [];

  for(let i=1;i<17;i++){
    //選択済みでないカードのクラスにclickedを削除
    const inputClass = document.getElementById(i);
    inputClass.className = `nonClicked`;
  }

}

//右クリック禁止
document.oncontextmenu = function () {return false;}

function setHeight() {
  // ウィンドウの高さを取得
  var windowHeight = window.innerHeight;
  console.log(windowHeight);
  // ページ全体のmax-heightにウィンドウの高さを代入
  document.documentElement.style.maxHeight = windowHeight + 'px';
}


// ウィンドウサイズが変更されたときにもsetHeightを実行
window.onresize = setHeight;
