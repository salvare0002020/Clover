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
  //カード一枚ドロー
  //https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=
  let draw1 = await fetch(apiUrl + "/deck/" + deckId + "/draw/?count=1");
  const card = await draw1.json();
  console.log(card);
});