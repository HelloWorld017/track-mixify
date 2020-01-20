<template>
	<div class="TmPlayerFile">
		<audio ref="audio" autoplay @ended="$emit('end')"></audio>
	</div>
</template>

<script>
	export default {
		props: {
			file: {
				type: String
			}
		},
		
		watch: {
			file(value) {
				this.$refs.audio.src = value;
				this.$refs.audio.load();
				this.$refs.audio.play();
			}
		}
	};
</script>
