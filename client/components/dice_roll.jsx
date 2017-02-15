import React, { Component } from 'react'

class DiceRoll extends Component {
  constructor (props) {
    super(props)
    this.handleDiceRollButtonClick = this.handleDiceRollButtonClick.bind(this)
    this.handleDoubles = this.handleDoubles.bind(this)
    this.handleAddDiceRollToUserPosition = this.handleAddDiceRollToUserPosition.bind(this)
    this.handleLandOnOrPassGo = this.handleLandOnOrPassGo.bind(this)
    this.handleEndTurnButtonClick = this.handleEndTurnButtonClick.bind(this)
    this.handleChancePos = this.handleChancePos.bind(this)

    this.state = {
      dice: [],
      diceSum: 0,
      diceSumComment: '',
      doubles: 0,
      doublesComment: '',
      currentUser: 0,
      diceRollButtonVisible: true,
      // needs to be updated gamestate authentication
      endTurnButtonVisible: false,
      userNames: ['Jeremy', 'Kyle', 'RJ', 'Joseph', 'Jeff', 'Justin', 'Jerry', 'Nino'],
      // up to 8 players all starting on GO or position 1
      userPositions: [0, 0, 0, 0, 0, 0, 0, 0],
      jailPositions: [0, 0, 0, 0, 0, 0, 0, 0]
    }
  }

  handleDiceRollButtonClick () {
    const die1 = 1 + Math.floor((6 * Math.random()))
    const die2 = 1 + Math.floor((6 * Math.random()))
    if(this.state.userPositions[this.state.currentUser] + die1 + die2 === 30) {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.state.currentUser]} rolled ${die1 + die2}, landing on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass Go. Do Not Collect $200.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        endTurnButtonVisible: true

      })

    }
    else if (die1 === die2) {
      this.handleDoubles(die1, die2)
      this.setState({
        dice: [die1, die2]
      })
      this.handleAddDiceRollToUserPosition(die1, die2, this.state.doubles)
    } else {
      this.setState({
        dice: [die1, die2],
        diceSum: die1 + die2,
        diceSumComment: `${this.state.userNames[this.state.currentUser]} rolled ${die1 + die2}. Move ${die1 + die2} spaces on the board.`,
        doubles: 0,
        doublesComment: '',
        diceRollButtonVisible: false,
        endTurnButtonVisible: true
      })
      this.handleAddDiceRollToUserPosition(die1, die2)
    }
  }

  handleEndTurnButtonClick () {
    let newCurrentUser = (this.state.currentUser + 1) % this.state.userPositions.length
    this.setState({
      currentUser: newCurrentUser,
      diceRollButtonVisible: true,
      endTurnButtonVisible: false
    })
  }

  handleDoubles (die1, die2) {
    if (this.state.doubles === 0) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`
      })
    } else if (this.state.doubles === 1) {
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: this.state.doubles += 1,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles! Move ${die1 + die2} spaces on the board, and roll again!`
      })
    } else if (this.state.doubles === 2) {
      let updatedUserPositions = this.state.userPositions
      updatedUserPositions[this.state.currentUser] = 10
      this.setState({
        dice: this.state.dice,
        diceSum: die1 + die2,
        diceSumComment: '',
        doubles: 0,
        doublesComment: `${this.state.userNames[this.state.currentUser]} rolled doubles three times in a row. Go to Jail. :(`,
        diceRollButtonVisible: false,
        endTurnButtonVisible: true,
        userPositions: 10
      })
    }
  }

  handleAddDiceRollToUserPosition (die1, die2, doubles) {
    console.log('handleAddDiceRollToUserPosition has been invoked!', this.state.userPositions[this.state.currentUser], die1 + die2)
    // store userPositions array
    let updatedUserPositions = this.state.userPositions
    // current player's old position
    let oldCurrentUserPosition = updatedUserPositions[this.state.currentUser]
    // update current player's position based on diceroll
    let updatedCurrentUserPosition = (oldCurrentUserPosition + die1 + die2) % 40
    // update the userPositions array with the new current players position
    updatedUserPositions[this.state.currentUser] = updatedCurrentUserPosition
    if (updatedUserPositions[this.state.currentUser] === 7 || updatedUserPositions[this.state.currentUser] === 22 || updatedUserPositions[this.state.currentUser] === 36 ) {
      this.handleChancePos(updatedUserPositions)
    }
    // update the current user to the next user
    if(updatedCurrentUserPosition === 30) {
      updatedCurrentUserPosition = 10
      updatedUserPositions[this.state.currentUser] = updatedCurrentUserPosition
      updatedJailPositions = this.state.jailPositions
      updatedJailPositions[this.state.currentUser] = 1
      this.setState({
        userPositions: updatedUserPositions,
        jailPositions: updatedJailPositions,
        doublesComment: 'You landed on Go-To-Jail. Go To Jail. Go Directly To Jail. Do Not Pass' +
        ' Go. Do Not Collect $200.'
      })
    }
    else {
      // check if the user is landing on or passing go, NOTE still need to deal with jail
      this.handleLandOnOrPassGo(oldCurrentUserPosition, updatedCurrentUserPosition)
      this.setState({
        // currentUser: newCurrentUser,
        userPositions: updatedUserPositions
      })
    }
    this.props.dice(this.state.userPositions)
  }

  handleChancePos (updatedUserPositions) {
    // get a chance card randomly
    const card = Math.floor((16* Math.random()))
    if (card === 0) {
      updatedUserPositions[this.state.currentUser] = 0
      // user money += 200
    } else if (card === 1) {
      // user money += 50
      // bankmoney -= 50
    } else if (card === 2) {
      updatedUserPositions[this.state.currentUser] = updatedUserPositions[this.state.currentUser] - 3
    } else if (card === 3) {
      // 12 & 28
      let buldDis = Math.abs(updatedUserPositions[this.state.currentUser] - 12)
      let waterDis = Math.abs(updatedUserPositions[this.state.currentUser] - 28)
      updatedUserPositions[this.state.currentUser] = (buldDis > waterDis) ? 28 : 12
    } else if (card === 4) {

    } else if (card === 5) {

    } else if (card === 6) {

    } else if (card === 7) {

    } else if (card === 8) {

    } else if (card === 9) {

    } else if (card === 10) {

    } else if (card === 11) {

    } else if (card === 12) {

    } else if (card === 13) {

    } else if (card === 14) {

    } else {

    }
  }

  handleLandOnOrPassGo (oldCurrentUserPosition, updatedCurrentUserPosition, jail) {
    if (!jail) {
      if (updatedCurrentUserPosition < oldCurrentUserPosition) {
        // give the currentUser $200
        this.setState({
        })
      }
    }
  }

  render () {
    return (
      <div className='user-positions_dice-roll_div'>
        <div className='dice-roll_div'>
          <div className='dice'>
            {this.state.diceRollButtonVisible ? `${this.state.userNames[this.state.currentUser]} it is your turn. Roll the dice!` : null}
            <div className='die1'>
              {this.state.dice[0] && this.state.endTurnButtonVisible? 'die1: ' : null} {this.state.endTurnButtonVisible? this.state.dice[0] : null}
            </div>
            <div className='die2'>
              {this.state.dice[1] && this.state.endTurnButtonVisible? 'die2: ' : null} {this.state.endTurnButtonVisible? this.state.dice[1] : null}
            </div>
            {/* <div>{this.state.diceSum}</div> */}
            <div>{this.state.endTurnButtonVisible? this.state.diceSumComment : null}</div>
          </div>
          <div className='doubles'>
            {this.state.doublesComment}
          </div>

          {
            this.state.diceRollButtonVisible?
              <button className='dice-roll-btn' onClick={() => { this.handleDiceRollButtonClick() }}>
              Roll Dice!
              </button> : this.state.endTurnButtonVisible?
              <button className='end-turn-btn' onClick={() => { this.handleEndTurnButtonClick() }}>
                End Turn.
              </button> : null
          }

        </div>
        <div className='UserPositions'>
          <div className='CurrentUser'>
            {/*{`The next user to roll is ${this.state.userNames[this.state.currentUser]} @ position ${this.state.userPositions[this.state.currentUser]}`}*/}
          </div>
          <div className='UserPositionsArray'>
            {/*<h5>{`The current state of user positions is ${this.state.userPositions}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[0]} is at position ${this.state.userPositions[0]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[1]} is at position ${this.state.userPositions[1]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[2]} is at position ${this.state.userPositions[2]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[3]} is at position ${this.state.userPositions[3]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[4]} is at position ${this.state.userPositions[4]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[5]} is at position ${this.state.userPositions[5]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[6]} is at position ${this.state.userPositions[6]}`}</h5>*/}
            {/*<h5>{`${this.state.userNames[7]} is at position ${this.state.userPositions[7]}`}</h5>*/}
          </div>
        </div>
      </div>
    )
  }
}

DiceRoll.propTypes = {
  dice: React.PropTypes.func.isRequired
}

export default DiceRoll
