import React, { Component } from "react";
import AudioAnalyser from "./AudioAnalyser";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audio: null,
    };
    this.toggleMicrophone = this.toggleMicrophone.bind(this);
  }

  getMicrophone() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then((stream) => {
        this.setState({ audio: stream });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", (event) => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        });
      });
  }

  stopMicrophone() {
    this.state.audio.getTracks().forEach((track) => track.stop());
    // const mediaRecorder = new MediaRecorder();
    // mediaRecorder.stop();
    this.setState({ audio: null });
  }

  toggleMicrophone() {
    if (this.state.audio) {
      this.stopMicrophone();
    } else {
      this.getMicrophone();
    }
  }
  render() {
    return (
      <div className="App">
        <div className="controls">
          <button onClick={this.toggleMicrophone}>
            {this.state.audio ? "Stop microphone" : "Get microphone input"}
          </button>
        </div>
        {this.state.audio ? <AudioAnalyser audio={this.state.audio} /> : ""}
      </div>
    );
  }
}

export default App;
