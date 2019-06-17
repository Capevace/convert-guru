<template>
	<section class="w-full file-drop-gradient rounded-lg shadow-inner">
		<div
			v-if="files.length === 0"
			class="flex flex-wrap w-full justify-center content-around h-64"
		>
			<div class="w-full text-center p-5">
				<input
					type="file"
					@change="onFileInputChange"
					ref="file-input"
					class="hidden"
				/>
				<button
					class="bg-indigo-700 px-4 py-2 rounded"
					@click="triggerFileInput"
				>
					Select a photo / video
				</button>
			</div>
			<span class="w-full text-center">or</span>
			<span class="w-full text-center p-5">Simply drop your files here</span>
		</div>
		<div class="flex flex-wrap w-full justify-between items-center p-5" v-else>
			<div v-for="(job, index) in jobsForType('video')" class="flex items-center justify-center w-1/2 h-64" :class="{'pr-2': index !== jobsForType('video').length - 1, 'pl-2': index !== 0 }">
				<button
					class="file-drop-gradient w-full h-full px-3 py-1 text-indigo-100 text-xl font-semibold rounded"
					@click="onJobButton(job)"
				>
					{{ labelForjob(job) }}
				</button>
			</div>
		</div>
	</section>
</template>
<script type="text/javascript">
import labelForjob from '../utils/label-for-job';
import jobsForType from '../utils/jobs-for-type';

export default {
	data: () => ({
		files: []
	}),
	methods: {
		labelForjob,
		jobsForType,
		triggerFileInput() {
			this.$refs['file-input'].click()
		},
		onFileInputChange(e) {
			this.files = e.target.files;
		},
		onJobButton(action) {
			this.$emit('job', {
				files: this.files,
				type: action
			});
		}
	}
}
</script>
