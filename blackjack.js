window.onload=function() {

//-------------------------------------------------------GLOBAL VARIABLES-------------------------------------------------------
    var cardsGlobal = [];
    var usedCards =[];
    var playerScore = 0;
    var dealerScore = 0;

    var deckId = "new";



//-------------------------------------------------------API CALL-------------------------------------------------------
   function getCards(id) {

       //set my URL for the call - change it here if I want to change what card deck type I call
       var url = "https://deckofcardsapi.com/api/deck/" + id + "/draw/?count=52";

        //The first line in the example above creates an XMLHttpRequest object
        var xhttp = new XMLHttpRequest();


        //The onreadystatechange property specifies a function to be executed every time the status of the XMLHttpRequest object changes:
        xhttp.onreadystatechange = function () {


            //When readyState property is 4 and the status property is 200, the response is ready:
            if (this.readyState == 4 && this.status == 200) {
                //Parse the cards into json
                var parsedCards = JSON.parse(this.responseText);

                for (var i = 0; i <  parsedCards.cards.length; i++) {
                    if(parsedCards.cards[i].value == "KING" || parsedCards.cards[i].value == "QUEEN" || parsedCards.cards[i].value == "JACK"){
                        parsedCards.cards[i].value = 10;
                    }
                    if(parsedCards.cards[i].value == "ACE"){
                        parsedCards.cards[i].value = 11;
                    }
                    if(parsedCards.cards[i].value != "KING" && parsedCards.cards[i].value != "QUEEN" && parsedCards.cards[i].value != "JACK" && parsedCards.cards[i].value != "ACE"){
                        parsedCards.cards[i].value = parseInt(parsedCards.cards[i].value);
                    }
                }

                console.log(url);
                cardsGlobal.push(parsedCards);
                firstDeal(cardsGlobal[0]);
            }

        };

        xhttp.open("GET", url, true);
        xhttp.send();

    }

    //-------------------------------------------------------API CALL-------------------------------------------------------
    function shuffleCards() {

        //set my URL for the call - change it here if I want to change what card deck type I call
        var url = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6";

        //The first line in the example above creates an XMLHttpRequest object
        var xhttp = new XMLHttpRequest();

        //The onreadystatechange property specifies a function to be executed every time the status of the XMLHttpRequest object changes:
        xhttp.onreadystatechange = function () {


            //When readyState property is 4 and the status property is 200, the response is ready:
            if (this.readyState == 4 && this.status == 200) {
                //Parse the cards into json
                var parsedDeck = JSON.parse(this.responseText);

                console.log(parsedDeck);
                deckId = parsedDeck.deck_id;

                console.log(deckId);

                // cardsGlobal.push(parsedCards);
                // firstDeal(cardsGlobal[0]);
            }

        };

        xhttp.open("GET", url, true);
        xhttp.send();

        getCards(deckId);

    }

//--------------------------------------------------DISPLAY THE CARDS: FIRST DEAL------------------------------------------
    function firstDeal(returnedCards) {
        var dealerCardsOutput = "";
        var playerCardsOutput = "";

        for (var i = 0; i < 4; i++) {
            dealerCardsOutput += "<img src=" + returnedCards.cards[i].image + ">";
            usedCards.push(returnedCards.cards[i]);
            dealerScore += returnedCards.cards[i].value;

            playerCardsOutput += "<img src=" + returnedCards.cards[i += 1].image + ">";
            usedCards.push(returnedCards.cards[i]);
            playerScore += returnedCards.cards[i].value;
        }

        document.getElementById("dealer_cards").innerHTML = dealerCardsOutput;
        document.getElementById("dealer_score").innerHTML = "Dealer: " + dealerScore;
        document.getElementById("player_cards").innerHTML = playerCardsOutput;
        document.getElementById("player_score").innerHTML = "Player: " + playerScore;

    }

//--------------------------------------------------DISPLAY THE CARDS: HIT------------------------------------------

    function hit() {
        var cardIndex = usedCards.length;

        document.getElementById("player_cards").innerHTML += "<img src=" + cardsGlobal[0].cards[cardIndex].image + ">";

        usedCards.push( cardsGlobal[0].cards[cardIndex]);

        playerScore += cardsGlobal[0].cards[cardIndex].value;

        document.getElementById("player_score").innerHTML = "Player: " + playerScore;

        checkWinner();

    }

//--------------------------------------------------DISPLAY THE CARDS: STAY------------------------------------------

    function stay() {
        var cardIndex = usedCards.length;

        document.getElementById("dealer_cards").innerHTML += "<img src=" + cardsGlobal[0].cards[cardIndex].image + ">";

        usedCards.push( cardsGlobal[0].cards[cardIndex]);

        dealerScore += cardsGlobal[0].cards[cardIndex].value;

        document.getElementById("dealer_score").innerHTML = "Dealer: " + dealerScore;

        checkWinner();

    }

    function checkWinner() {
        if (playerScore === 21 || dealerScore > 21) {

            document.getElementById("outcome").innerHTML = "Player wins!";

            document.getElementById("btnStart").style.display = 'none';
            document.getElementById("hit").style.display = 'none';
            document.getElementById("stay").style.display = 'none';
            document.getElementById("restart").style.display = 'block';
        }

        if (dealerScore === 21 || playerScore > 21) {

            document.getElementById("outcome").innerHTML = "Dealer wins!";

            document.getElementById("btnStart").style.display = 'none';
            document.getElementById("hit").style.display = 'none';
            document.getElementById("stay").style.display = 'none';
            document.getElementById("restart").style.display = 'block';
        }
    }

    function reset() {

        playerScore = 0;
        dealerScore = 0;
        cardsGlobal = [];
        document.getElementById("dealer_cards").innerHTML = "";
        document.getElementById("dealer_score").innerHTML = "";
        document.getElementById("player_cards").innerHTML = "";
        document.getElementById("player_score").innerHTML = "";
        document.getElementById("outcome").innerHTML = "";

        document.getElementById("hit").style.display = 'block';
        document.getElementById("stay").style.display = 'block';
        document.getElementById("restart").style.display = 'none';

        shuffleCards();
    }



//--------------------------------------------------MAKE CALLS-------------------------------------------------------------

document.getElementById("btnStart").addEventListener("click", shuffleCards);
document.getElementById("hit").addEventListener("click", hit);
document.getElementById("stay").addEventListener("click", stay);

document.getElementById("restart").addEventListener("click", reset);

    console.log(usedCards);

};
