<template>
	<div
		class="header-gradient text-white px-16 relative antialiased min-h-screen pb-5"
	>
		<Header></Header>
		<main v-if="!editJob && !renderJob" class="w-1/2 flex flex-wrap m-auto">
			<p class="text-5xl text-center w-full py-16">
				Convert&nbsp;
				<span class="font-mono bg-gray-800 rounded p-1">.mp4</span>&nbsp; to&nbsp;
				<span class="font-mono bg-gray-800 rounded p-1">.gif</span><br>
				in your browser!
			</p>
			<FileSelector @job="onJobCreated"></FileSelector>
		</main>
		<div v-else-if="editJob && !renderJob" class="bg- text-gray-900 px-8 py-6">
			<VideoEditor :job="editJob" @export="onEditorExport"></VideoEditor>
		</div>
		<div v-else class="bg- text-gray-900 px-8 py-6">
			<VideoRenderer :job="renderJob" @back="editJob = renderJob = null"></VideoRenderer>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
import FileSelector from '../components/FileSelector';
import VideoEditor from '../components/VideoEditor';
import VideoRenderer from '../components/VideoRenderer';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default {
	data: () => ({
		editJob: null,
		renderJob: null
	}),
	components: {
		FileSelector,
		VideoEditor,
		VideoRenderer,
		Header,
		Footer
	},
	methods: {
		onJobCreated(job) {
			// this.renderJob = { type: 'convert-to-gif', files: job.files, settings: { startAt: 2, endAt: 25 } };
			this.editJob = job;
		},
		onEditorExport(renderJob) {
			this.renderJob = renderJob;
		}
	}
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.title {
	font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
		'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	display: block;
	font-weight: 300;
	font-size: 100px;
	color: #35495e;
	letter-spacing: 1px;
}

.subtitle {
	font-weight: 300;
	font-size: 42px;
	color: #526488;
	word-spacing: 5px;
	padding-bottom: 15px;
}

.links {
	padding-top: 15px;
}
</style>
