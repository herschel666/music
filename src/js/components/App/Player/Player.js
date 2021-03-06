import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';

import Analyser from './Analyser';

import { getNextIndex } from '../../../services/audio';

import { isTouch } from '../../../util/browser';

import configApp from '../../../../data/app.json';


class Player extends React.Component {
    componentDidMount() {
        const { initAudio } = this.props;
        initAudio();
        this.loadAudio();
        document.addEventListener('keydown', this.captureKeys);
    }

    componentDidUpdate(lastProps) {
        const { activeIndex, initAudio, isLoggedIn, playToggle } = this.props;
        if (lastProps.isLoggedIn !== isLoggedIn) {
            initAudio();
        }
        if (lastProps.activeIndex !== activeIndex) {
            // accept values greater than -1, because -1 is initial index
            this.loadAudio(~lastProps.activeIndex);
        }
        if (lastProps.playToggle !== playToggle) {
            this.togglePlay();
        }
    }

    @autobind
    captureKeys(e) {
        switch (e.keyCode) {
            case 32:
                e.preventDefault();
                this.togglePlay();
                break;
            case 37:
                e.preventDefault();
                this.decreaseTimeFrame();
                break;
            case 39:
                e.preventDefault();
                this.increaseTimeFrame();
                break;
            default:
        }
    }

    loadAudio(play = false) {
        const { tracks, activeIndex, setActiveTrack } = this.props;
        const file = tracks[activeIndex];
        if (file) {
            setActiveTrack(file);
            this.pause();
            this.audio.loop = !!file.loop;
            this.audio.src = file.path;
            this.audio.title = `${file.tag.artist} - ${file.tag.title}`;
            if (play) {
                this.play();
            } else {
                this.audio.load();
            }
        }
    }

    play() {
        this.audio.play();
    }

    pause() {
        this.audio.pause();
    }

    togglePlay() {
        const { isPlaying } = this.props;
        if (!isPlaying) {
            this.play();
        } else {
            this.pause();
        }
    }

    increaseTimeFrame() {
        this.audio.currentTime += 5;
    }

    decreaseTimeFrame() {
        this.audio.currentTime -= 5;
    }

    @autobind
    handlePlay() {
        const { setIsPlaying } = this.props;
        setIsPlaying(true);
    }

    @autobind
    handlePause() {
        const { setIsPlaying } = this.props;
        setIsPlaying(false);
    }

    @autobind
    handleError() {
        const { setIsPlaying } = this.props;
        setIsPlaying(false);
    }

    @autobind
    handleEnded() {
        const { activeIndex, tracks, setActiveIndex } = this.props;
        setActiveIndex(getNextIndex(activeIndex, tracks));
    }

    isAnalyserAllowed() {
        return !isTouch() && configApp.useAnalyser;
    }

    render() {
        const { isPlaying } = this.props;
        const showAnalyser = this.isAnalyserAllowed() && this.audio;

        return (
            <div className="player">
                {!showAnalyser ? null : (
                    <Analyser
                        audio={this.audio}
                        isPlaying={isPlaying}
                    />
                )}
                <audio
                    className="audio"
                    preload="none"
                    controls
                    ref={(ref) => {
                        this.audio = ref;
                    }}
                    onPlay={this.handlePlay}
                    onPause={this.handlePause}
                    onEnded={this.handleEnded}
                    onError={this.handleError}
                />
            </div>
        );
    }
}

Player.propTypes = {
    initAudio: PropTypes.func.isRequired,
    setActiveTrack: PropTypes.func.isRequired,
    setActiveIndex: PropTypes.func.isRequired,
    setIsPlaying: PropTypes.func.isRequired,
    tracks: PropTypes.array.isRequired,
    activeIndex: PropTypes.number.isRequired,
    playToggle: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

export default Player;
