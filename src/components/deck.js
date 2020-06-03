import React, { Component } from 'react';

class Deck extends Component {
    state = { 
        deckId: null,
        currentCard: null,
        currentValue: null,
        lastValue: null,
        cardsRemaining: null,
        betHigher: null,
        betting: false,
        wins: 0
    };
    async componentDidMount() {
        //iniciate the deck
       const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
       const data = await response.json();
       this.setState({deckId: data.deck_id})
        this.drawCard(data.deck_id);
    }
    async drawCard (id) {
        // get a new card from the deck
        const newCard = await fetch('https://deckofcardsapi.com/api/deck/' + id + '/draw/?count=1');
        const card = await newCard.json();
        this.setState({currentCard: card.cards[0]})

        // get the deck to see how many cards are left
        const deck = await fetch('https://deckofcardsapi.com/api/deck/' + id);
        const data = await deck.json();
        this.setState({ cardsRemaining: data.remaining})

        // transform card values into numbers jack=10, queen=11 etc
        if(this.state.currentCard.value === "ACE") {
            this.setState({currentValue: 13})
        } else if(this.state.currentCard.value === "KING"){
            this.setState({currentValue: 12})
        }else if(this.state.currentCard.value === "QUEEN"){
            this.setState({currentValue: 11})
        }else if(this.state.currentCard.value === "JACK"){
            this.setState({currentValue: 10})
        }else {
            this.setState({currentValue: parseInt(this.state.currentCard.value,10)})
        }

        //evaluate the result of the bet
        if(this.state.betting) {
            //did you win
            if (this.state.currentValue > this.state.lastValue && this.state.betHigher === true) {
                this.setState({wins: this.state.wins+1 })
            } else if (this.state.currentValue < this.state.lastValue && this.state.betHigher === false) {
                this.setState({wins: this.state.wins+1 })
            } 
           
        }
         // reset for the next round
        this.setState({ betting: false, lastValue: this.state.currentValue });
    }
    betHight() {
        this.setState({ 
            betHigher: true,
            betting: true 
        });
    }
    betLow() {
        this.setState({ 
            betHigher: false,
            betting: true
        });
    }

    render() {
        return (
            <div>
                <p>Deck ID: {this.state.deckId ? this.state.deckId : 'no Deck fetched' }</p>
                <button onClick={() => this.drawCard(this.state.deckId)}>new card</button>
                { this.state.currentCard &&
                 <img src={this.state.currentCard.image} alt="currentCard"></img>}
                <button onClick={() => this.betHight()}>Bet higher</button>
                <button onClick={() => this.betLow()}>Bet lower</button>
                <h1>Wins: {this.state.wins}</h1>
                <h1>Cards left: {this.state.cardsRemaining ? this.state.cardsRemaining : 0}</h1>
            </div>
        );
    }
}
export default Deck;
