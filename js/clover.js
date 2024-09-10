const apiUrl = "https://deckofcardsapi.com/api/";
//共通処理用変数
let deckId;
let cardNumber = 0;
let deckCount = 48;
let deforCalNumber;
let isDeckZero = Boolean(false);
//座標別判定用
  //true格納用配列
  let changedPoints =[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]];
//   let changedPoints =[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
//   ,[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
//   ,[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
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
    const card = await draw1.json();
    console.log(card);
    let createAria;
    for(let i = 0; i < 16; i++){
        console.log(i);
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
        console.log("テスト");
        if(cardValue == "JACK"){
          JACK = true;
        }else if(cardValue == "QUEEN"){
          QUEEN = true;
        }else{
          console.log("テスト");
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
    }else if(cardValue == "ACE"){
      cardNumber -= 1;
    }
  
    if(cardNumber == 0){
      if(cardValue == "JACK" || cardValue == "QUEEN" || cardValue == "KING"){
        console.log("テスト");
        if(cardValue == "JACK"){
          JACK = false;
        }else if(cardValue == "QUEEN"){
          QUEEN = false;
        }else{
          console.log("テスト");
          KING = false;
        }
      }
    }
  }

  console.log("JACK : "+JACK);
  console.log("QUEEN : "+QUEEN);
  console.log("KING : "+KING);
  console.log("countSelectedCard : "+countSelectedCard);
  console.log("選択済みの数値の合計 : "+cardNumber);
  console.log("changedPoints["+clickingX+"]["+clickingY+"] : "+changedPoints[clickingX][clickingY]);

  if(cardNumber == 15 || JACK == true && QUEEN == true && KING == true){
    console.log("削除実行");  
    deleteCard();
  }
}

//完成済み
//selectCard()から呼び出し : 選択状態かどうかの判定を行う
function markedPoints(divId,cardSuit,cardValue) {
  //座標の調節
  let xy = Number(divId);
  let clickingX = xy % 4;
  let clickingY = Math.ceil(xy / 4)-1;
  if(clickingX == 0){
    clickingX = 4;
  }
  clickingX -= 1;

  //クリック済みの座標格納
  if (selectedCardSuit == null) {
    //マークがまだ選択されていないとき
    selectedCardSuit = cardSuit;
  }
  if(selectedCardType == null){
    if(cardValue == "ACE" || cardValue == "2" || cardValue == "3" || cardValue == "4" || cardValue == "5" || cardValue == "6" || cardValue == "7" || cardValue == "8" || cardValue == "9"|| cardValue == "10"){
      selectedCardType = "number";
    }else{
      selectedCardType = "String";
    }
  }
  
  //直前にクリックしたカードの種類
  if(cardValue == "ACE" || cardValue == "2" || cardValue == "3" || cardValue == "4" || cardValue == "5" || cardValue == "6" || cardValue == "7" || cardValue == "8" || cardValue == "9"|| cardValue == "10"){
    cardType = "number";
  }else{
    cardType = "String";
  }
  console.log("cardType : "+cardType);
  console.log("cardNumber : " + cardNumber);
  console.log("cardValue : "+ cardValue);

  deforCalNumber = Number(cardNumber) + Number(cardValue);
  console.log(deforCalNumber);

  if(cardType == selectedCardType){
    if (selectedCardSuit == cardSuit) {
      //マークが同じとき(truePointsに登録)
      // changedPoints[clickingX][clickingY] == false && cardType == "number" && isNumber <= 15 || changedPoints[clickingX][clickingY] == false && cardType == "String"
      // changedPoints[clickingX][clickingY] == false || changedPoints[clickingX][clickingY] == false && cardType == "String"
      if (changedPoints[clickingX][clickingY] == false && cardType == "number" && deforCalNumber <= 15 || changedPoints[clickingX][clickingY] == false && cardType == "String") {
        console.log("登録処理実行");
        changedPoints[clickingX][clickingY] = true;
        imgID.push(divId);
        truePointsX.push(clickingX);
        truePointsY.push(clickingY);
        countSelectedCard += 1;
      } else if(changedPoints[clickingX][clickingY] == true && cardType == "number" && deforCalNumber < 15 ||changedPoints[clickingX][clickingY] == true){
        //(truePointsから登録解除)
        console.log("登録解除処理実行");
        changedPoints[clickingX][clickingY] = false;
        imgID.pop(divId);
        truePointsX.pop(clickingX);
        truePointsY.pop(clickingY);
        countSelectedCard -= 1;
      }else{
        console.log("値が15以上のためスキップ");
      }
    }
  }

  if(countSelectedCard == 0){
    //選択済み状態のカードの数が0のとき
    selectedCardType = null;
    selectedCardSuit = null;
    cardNumber =0;
  }
}

async function deleteCard() {
  //ドロー枚数の調整
  let reDraw;
  let card;
  deckCount-= countSelectedCard;
  if(countSelectedCard<=deckCount){
    //選択状態のカード枚数 < デッキ枚数
    reDraw = await fetch(apiUrl + "deck/" + deckId + "/draw/?count=" + countSelectedCard);
    // 選択状態の枚数分カードを引き、入れ替える
    card = await reDraw.json(); // awaitを追加
  }else if(deckCount < countSelectedCard && deckCount==0){
    //選択状態のカード枚数 >= デッキ枚数
    if(deckCount != 0){
      let requestDraw = deckCount - countSelectedCard;
      reDraw = await fetch(apiUrl + "deck/" + deckId + "/draw/?count=" + requestDraw);
      // 選択状態の枚数分カードを引き、入れ替える
      card = await reDraw.json(); // awaitを追加
    }else{
      isDeckZero = true;
      return;
    }
    
  }

  for (let x = 0; x < countSelectedCard; x++) {
    console.log("変換進捗 : "+(x+1)+"/"+(countSelectedCard));
    //取得が成功した場合
    if(deckCount - countSelectedCard == 0){
      // idを取得
      console.log(`truePointsX[${x}]: ${truePointsX[x]}, truePointsY[${x}]: ${truePointsY[x]}, imgID: ${imgID[x]}`);
      let reInputIMG = document.getElementById(imgID[x]);
      if (reInputIMG) {
        let imgElement = reInputIMG.getElementsByTagName("img")[0];
        imgElement.src = "https://deckofcardsapi.com/static/img/back.png";
        imgElement.className = "none";
      }
    }
    if(card.success == true){
      console.log("カード取得成功");
      // 新しいカードの情報を取得
      const cardImg = card.cards[x].image;
      const cardSuit = card.cards[x].suit;
      const cardValue = card.cards[x].value;
      console.log(cardImg);

      // idを取得
      console.log(`truePointsX[${x}]: ${truePointsX[x]}, truePointsY[${x}]: ${truePointsY[x]}, imgID: ${imgID[x]}`);
      let reInputIMG = document.getElementById(imgID[x]);
      if (reInputIMG) {
        let imgElement = reInputIMG.getElementsByTagName("img")[0];
        imgElement.src = cardImg;
        imgElement.className = cardSuit + " " + "card" + " " + cardValue;
        
      } else {
        console.error("ID " + imgID[x] + " の要素が見つかりませんでした。");
      }
    }else{
      //取得失敗

      // idを取得
      console.log(`truePointsX[${x}]: ${truePointsX[x]}, truePointsY[${x}]: ${truePointsY[x]}, imgID: ${imgID[x]}`);
      let reInputIMG = document.getElementById(imgID[x]);
      if (reInputIMG) {
        let imgElement = reInputIMG.getElementsByTagName("img")[0];
        imgElement.src = "https://deckofcardsapi.com/static/img/back.png";
        imgElement.className = "none";
        
      } else {
        console.error(card.error);
        console.error("ID " + imgID[x] + " の要素が見つかりませんでした。");
      }
    }
  }
    console.log("残り山札 : "+deckCount);
    if(deckCount == 0){
      console.log("clear!");
    }
    
   resetCount()
}

function resetCount(){
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
//   changedPoints =[[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
//   ,[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
//   ,[false,false,false,false],[false,false,false,false],[false,false,false,false],[false,false,false,false]
// ];
  deforCalNumber = 0;
  countSelectedCard = 0;
}
