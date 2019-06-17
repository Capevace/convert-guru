<template>
	<canvas 
		class="bg-black mb-5" 
		:width="canvasSize.width" 
		:height="canvasSize.height" 
		ref="canvas"></canvas>
</template>
<script type="text/javascript">
export default {
	props: {
		videoState: Object
	},
	data: () => ({
		canvasSize: { width: 480, height: 270 }
	}),
	mounted() {
		this.canvasContext = this.$refs.canvas.getContext('2d');
	},
	methods: {
		onReady(videoState, video) {
			this.canvasSize = { width: video.videoWidth, height: video.videoHeight };
		},
		onFrame(videoState, video) {
			if (!this.canvasContext) return;

			this.canvasContext.drawImage(video, 0, 0);
		}
	},
};
</script>