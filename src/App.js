import React, { Component } from "react";
import styled from "styled-components";

const Game = styled.div`
  width: ${props => props.width + "px"};
  height: ${props => props.height + "px"};
  background-color: #255;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  position: absolute;
  left: 0;
  right: 0;
`;

const Centerline = styled.div`
  height: ${props => props.height - 10 + "px"};
  outline: black dashed 2px;
  position: absolute;
  left: 50%;
`;

const Paddle = styled.div.attrs(props => ({
  style: {
    transform: `translate(0,${props.position}px`
  }
}))`
  width: ${props => props.width + "px"};
  height: 75px;
  background-color: black;
  position: relative;
  transition: transform 0.05s;
`;

const Ball = styled.div.attrs(props => ({
  style: {
    transform: `translate(${props.position.x}px, ${props.position.y}px)`
  }
}))`
  border-radius: 20px;
  border: black;
  background: black;
  width: ${props => props.size + "px"};
  height: ${props => props.size + "px"};
  position: absolute;
`;

const width = 600;
const height = 400;
class App extends Component {
  state = {
    width: width,
    height: height,
    ballX: width / 2,
    ballY: height / 2,
    ballXDir: 5,
    ballYDir: 5,
    ballSize: 20,
    paddleWidth: 15,
    paddleHeight: 75,
    paddleLeft: 0,
    paddleRight: 0,
    score: {
      left: 0,
      right: 0
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.handleKeypress);
    //requestAnimationFrame(() => this.moveBall());

    // Added requestAnimationFrame
    this.moveBall();
  }

  handleKeypress = e => {
    let { key } = e;
    switch (key) {
      case "w":
        this.moveUp("left");
        break;
      case "s":
        this.moveDown("left");
        break;
      case "o":
        this.moveUp("right");
        break;
      case "l":
        this.moveDown("right");
        break;
      default:
        break;
    }
  };

  moveUp = paddle => {
    if (paddle === "left") {
      this.setState(prevState => ({
        paddleLeft: prevState.paddleLeft - 20
      }));
    } else {
      this.setState(prevState => ({
        paddleRight: prevState.paddleRight - 20
      }));
    }
  };
  moveDown = paddle => {
    if (paddle === "left") {
      this.setState(prevState => ({
        paddleLeft: prevState.paddleLeft + 20
      }));
    } else {
      this.setState(prevState => ({
        paddleRight: prevState.paddleRight + 20
      }));
    }
  };

  moveBall = () => {
    requestAnimationFrame(this.moveBall);
    let {
      ballX,
      ballY,
      ballXDir,
      ballYDir,
      ballSize,
      paddleWidth,
      paddleLeft,
      paddleRight,
      paddleHeight,
      score
    } = this.state;
    // Test new positions --
    let newBallY = ballY - ballYDir;
    let newBallX = ballX - ballXDir;
    // Ceiling
    if (newBallY < 0 || newBallY > height - ballSize) {
      ballYDir *= -1;
    }

    // --paddles
    // left
    if (
      newBallX < 0 + paddleWidth &&
      (newBallY + ballSize / 2 > paddleLeft &&
        newBallY - ballSize / 2 < paddleLeft + paddleHeight)
    ) {
      ballXDir *= -1;
    }
    // right
    if (
      newBallX > width - paddleWidth - ballSize &&
      (newBallY + ballSize / 2 > paddleRight &&
        newBallY - ballSize / 2 < paddleRight + paddleHeight)
    ) {
      ballXDir *= -1;
    }
    // -- adjust for direction resets... should be a better way
    newBallY = ballY - ballYDir;
    newBallX = ballX - ballXDir;
    // Check to see if anyone scored
    if (newBallX < 0) {
      ++score.right;
      newBallX = width / 2;
      newBallY = height / 2;
    }
    if (newBallX > width - ballSize) {
      ++score.left;
      newBallX = width / 2;
      newBallY = height / 2;
    }
    // set new positions and new directions
    this.setState(prevState => ({
      ballY: newBallY,
      ballYDir: ballYDir,
      ballX: newBallX,
      ballXDir: ballXDir
    }));
  };

  render() {
    return (
      <Game width={this.state.width} height={this.state.height}>
        <Paddle
          width={this.state.paddleWidth}
          position={this.state.paddleLeft}
        />
        <Centerline height={this.state.height} />
        <Ball
          size={this.state.ballSize}
          position={{ x: this.state.ballX, y: this.state.ballY }}
        />
        <Paddle
          width={this.state.paddleWidth}
          position={this.state.paddleRight}
        />
      </Game>
    );
  }
}

export default App;
