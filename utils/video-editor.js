export default class VideoEditor extends EventTarget {
	constructor(videoFile) {
		super();

		this.ready = false;
		this.loop = true;
		this.playing = false;
		this.duration = 0;
		this.currentTime = 0;
		this.startAt = 0;
		this.endAt = 0;
		this.video = this._setupVideo(videoFile);
	}

	_setupVideo(videoFile) {
		const video = document.createElement('video');
		video.src = (window.URL || window.webkitURL).createObjectURL(
			videoFile
		);
		video.muted = true;
		video.load();
		video.onloadeddata = () => {
			this.duration = video.duration;
			this.currentTime = 0;
			this.startAt = 0;
			this.endAt = video.duration;
			this.ready = true;

			this.dispatchEvent(this._createEvent('ready', { video }));
		};

		video.addEventListener('ended', () => {
			if (this.loop) {
				this.play();
			} else {
				this.pause();
			}
		});

		return video;
	}

	play() {
		this.playing = true;
		this.video.currentTime = +this.startAt.toFixed(2);
		this.video.play();

		this.dispatchEvent(this._createEvent('playing'));
		this._frameLoop();
	}

	pause() {
		this.playing = false;
		this.video.pause();

		this.dispatchEvent(this._createEvent('playing'));
	}

	getVideoState() {
		return {
			ready: this.ready,
			playing: this.playing,
			duration: this.duration,
			currentTime: this.currentTime,
			startAt: this.startAt,
			endAt: this.endAt
		};
	}

	_createEvent(name, data) {
		const event = new Event(name);
		event.videoState = this.getVideoState();

		for (const key in data) {
			event[key] = data[key];
		}

		return event;
	}

	_frameLoop() {
		if (!this.playing) {
			return;
		}

		if (this.video.currentTime < +this.startAt.toFixed(2)) {
			this.video.currentTime = +this.startAt.toFixed(2);
		} else if (this.video.currentTime > this.endAt) {
			if (this.loop) {
				this.video.currentTime = +this.startAt.toFixed(2);
			} else {
				this.pause();
				this.video.currentTime = +this.startAt.toFixed(2);
				return;
			}
		}

		this.currentTime = this.video.currentTime;
		this.dispatchEvent(this._createEvent('frame', { video: this.video }));
		setTimeout(this._frameLoop.bind(this), 1000 / 30);
	}

	setStartAt(time) {
		this.startAt = time;

		if (this.currentTime < +this.startAt.toFixed(2)) {
			this.currentTime = +this.startAt.toFixed(2);
		}

		this.dispatchEvent(this._createEvent('trimmed'));
	}

	setEndAt(time) {
		this.endAt = time;
		this.dispatchEvent(this._createEvent('trimmed'));
	}
}