'use strict';

var numberOfRows = 0;
var numberOfColumns = 0;
var numberOfCards = 0;
var numberOfRevealedCards = 0;
var clickCount = 0;
var numberPairArray = [];
var currentFlippedCards = [];
var coverCardsTimer;

function Start() {
    // Reset values to their initial states
    numberOfRevealedCards = 0;
    clickCount = 0;
    $('#clicked').val(clickCount);
    $('#win-screen').hide();
    $('table').remove();
    numberOfRows = $('#Rows').val();
    numberOfColumns = $('#Columns').val();
    numberOfCards = numberOfRows * numberOfColumns;
    numberPairArray = [];

    CreateTable();
    CreateCardArray();
    PlaceCards();
    AddEventListener();
}

// Create a table with number of rows & columns in the input fields
function CreateTable() {
    var $table = $('<table></table>').appendTo('#table-section');
    for (var i = 0; i < numberOfRows; i++) {
        var $row = $('<tr></tr>').appendTo($table);
        for (var j = 0; j < numberOfColumns; j++) {
            $('<td></td>').appendTo($row);
        }
    }
}

// Create a array of pairs. The number of pairs = total of cards divided by 2.
function CreateCardArray() {
    var numberOfPairs = numberOfCards / 2;
    for (var i = 0; i < numberOfPairs; i++) {
        numberPairArray.push(i);
        numberPairArray.push(i);
    }
    Shuffle(numberPairArray);
}

function Shuffle(arr) {
    var arrayLength = arr.length;
    for (var i = arrayLength - 1; i >= 0; i--) {
        var randomIndex = Math.floor(Math.random() * i);
        var tempVal = arr[i];
        arr[i] = arr[randomIndex];
        arr[randomIndex] = tempVal;
    }
}

// Iterate through both cards array and cells array, then place the card to each cell.
function PlaceCards() {
    var $cells = $('td');
    for (var i = 0; i < numberOfCards; i++) {
        $cells.eq(i).data('card', numberPairArray[i]);
    }
}

function AddEventListener() {
    $('td').click(FlipCard);
    $('#restart').click(Start);
}

function FlipCard(e) {
    clickCount += 1;
    var $flippedCard = $(e.target);
    $('#clicked').val(clickCount);
    currentFlippedCards.push($flippedCard);
    $flippedCard.text($flippedCard.data('card'));
    $flippedCard.unbind('click', FlipCard);
    $flippedCard.addClass('flippedCard');

    if (currentFlippedCards.length == 2) {
        // Flip the clicked card, if it was not a pair cover both cards after 0.5 second.
        if (currentFlippedCards[0].text() == currentFlippedCards[1].text()) {
            currentFlippedCards = [];
            numberOfRevealedCards += 2;
            WinConditionCheck();
        } else {
            coverCardsTimer = setTimeout(function() { CoverCards() }, 500);
        }
    } else if (currentFlippedCards.length >= 3) {
        // Immediately covers the unmatched cards, then flip the last clicked card.
        clearTimeout(coverCardsTimer);
        CoverCards();
        FlipCard(e);
    }
}

function WinConditionCheck() {
    if (numberOfRevealedCards == numberOfCards) {
        $('#win-screen').show();
    }
}

function CoverCards() {
    for (var i = 0; i < currentFlippedCards.length; i++) {
        currentFlippedCards[i].text(null);
        currentFlippedCards[i].bind('click', FlipCard);
        currentFlippedCards[i].removeClass();
    }
    currentFlippedCards = [];
}

$(document).ready(function() {
    Start();
    $('input').change(Start);
});
