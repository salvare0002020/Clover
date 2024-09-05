const apiUrl = "https://deckofcardsapi.com/api/";
let bolCreateDeck = Boolean (false);
document.getElementById("get").addEventListener("click", async () => {
  
  let response;
  let deck;
  let deckId;
    response = await fetch(apiUrl + "deck/new/shuffle/?deck_count=1");
    deck = await response.json();
    console.log(deck);
    deckId = deck.deck_id;
    console.log(deckId);
    bolCreateDeck = true;
    console.log(bolCreateDeck);
  //カード16枚ドロー
  //https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=
  let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=16");
  const card = await draw1.json();
  let createAria;
  for(let i = 0;i<4;i++){
    for(let x=0;x<4;x++){
      let y = i*4 + x;
      const cardImg = card.cards[y].image;
      const cardSuit = card.cards[y].suit;
      const cardValue = card.cards[y].value;
      console.log(card);
      console.log(cardImg);
      console.log(cardValue);
    const image = document.createElement("img");
    image.src=cardImg;
    image.setAttribute("class",cardSuit);
    // image.setAttribute("id",);

    createAria = document.getElementById("play");
    createAria.appendChild(image);
    }
    const p = document.createElement("p");
    createAria.appendChild(p);
  }
});