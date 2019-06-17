<template>
	<div
		class="relative"
		ref="container"
		@mouseup="stopTrimming"
		@mousemove="updateTrim"
		v-if="videoState"
	>
		<div
			class="absolute left-0 right-0 bottom-0 h-8 bg-gray-400 rounded-lg flex justify-between items-center px-1 font-bold text-gray-700"
			:style="barStyle"
			@mousedown="startTrimming($event, 'center')"
		>
			<span
				class="w-2 bg-yellow-500 absolute top-0 bottom-0"
				:style="currentTimeStyle"
			></span>
			<span
				class="cursor-pointer select-none bg-gray-200 rounded px-2"
				@mousedown="startTrimming($event, 'start')"
			>
				||
				<span
					class="text-xs pointer-events-none"
					v-if="tracking === 'start' && !forceHideTimecode"
				>
					{{ startAt.toFixed(2) }}sec
				</span>
			</span>
			<span
				class="cursor-default text-xs pointer-events-none select-none"
				v-if="!forceHideTimecode"
			>
				{{ trimmedVideoLength.toFixed(2) }}sec
			</span>
			<span
				class="cursor-pointer select-none bg-gray-200 rounded px-2"
				@mousedown="startTrimming($event, 'end')"
			>
				<span
					class="text-xs pointer-events-none"
					v-if="tracking === 'end' && !forceHideTimecode"
				>
					{{ endAt.toFixed(2) }}sec
				</span>
				||
			</span>
		</div>
	</div>
</template>
<script type="text/javascript">
const calculateStartAt = (x, width, duration, endAt) => {
	let startAt = (x / width) * duration;

	// start at has to be bigger than 0
	startAt = Math.max(startAt, 0);

	// startAt has to be min 10% before endAt
	startAt = Math.min(startAt, (endAt / duration - 0.1) * duration);

	return startAt;
};

const calculateEndAt = (x, width, duration, startAt) => {
	let endAt = (x / width) * duration;

	// start at has to be smaller than the duration
	endAt = Math.min(endAt, duration);

	// startAt has to be min 10% after startAt
	endAt = Math.max(endAt, (startAt / duration + 0.1) * duration);

	return endAt;
};

export default {
	props: {
		videoState: {
			type: Object,
			default: null
		}
	},
	data: props => ({
		tracking: null,
		forceHideTimecode: false,
		startAt: 0,
		endAt: 0
	}),
	computed: {
		trimmedVideoLength() {
			if (!this.videoState) return 0;

			return this.videoState.duration - (this.videoState.duration - this.videoState.endAt) - this.videoState.startAt;
		},
		barStyle() {
			if (!this.videoState)
				return {
					left: `0px`,
					right: `0px`
				};

			const width = this.$refs.container ? this.$refs.container.clientWidth : 0;

			return {
				left: `${(this.videoState.startAt / this.videoState.duration) * width}px`,
				right: `${width -
					(this.videoState.endAt / this.videoState.duration) * width}px`
			};
		},
		currentTimeStyle() {
			if (!this.videoState)
				return {
					transform: 'translateX(0px)'
				};

			const width = this.$refs.container ? this.$refs.container.clientWidth : 0;

			// current time cant be bigger than the endAt time
			let currentTime = Math.min(this.videoState.currentTime, this.videoState.endAt);

			// current time cant be smaller then the start at time
			currentTime = Math.max(currentTime, this.videoState.startAt);

			// we get the percentage of the current time on the video length minus the trim
			// const durationMinusTrim = this.videoState.duration - (this.videoState.duration - this.videoState.endAt) - this.videoState.startAt;
			const currentTimePercentage = currentTime / (this.videoState.duration);
			// and then we calculate the x offset on the trim bar using that percentage
			const currentTimeXOffset = currentTimePercentage * width - (this.videoState.startAt / this.videoState.duration * width);

			return {
				transform: `translateX(${currentTimeXOffset}px)`
			};
		}
	},
	methods: {
		startTrimming(e, side) {
			if (this.tracking) return;

			this.tracking = side;
		},
		stopTrimming(e) {
			this.tracking = null;
		},

		updateTrim(e) {
			if (!this.tracking) return;

			const rect = this.$refs.container.getBoundingClientRect();
			const x = e.clientX - rect.left;

			if (this.tracking === 'start') {
				this.startAt = calculateStartAt(
					x - 20, // remove margin from the bar
					rect.width,
					this.videoState.duration,
					this.videoState.endAt
				);

				this.$emit('start', this.startAt);
			} else if (this.tracking === 'end') {
				this.endAt = calculateEndAt(
					x + 20, // add margin from the bar
					rect.width,
					this.videoState.duration,
					this.videoState.startAt
				);

				this.$emit('end', this.endAt);
			}

			this.checkHideTimecode();
		},
		checkHideTimecode() {
			this.forceHideTimecode = false;

			// If the width of the trim bar is less than 30% of the full width,
			// we have to hide the timecode label for spacing.
			const endAtPercentage = this.videoState.endAt / this.videoState.duration;
			const startAtPercentage = this.videoState.startAt / this.videoState.duration;
			if (endAtPercentage - startAtPercentage < 0.3) {
				this.forceHideTimecode = true;
			}
		}
	}
};
</script>
