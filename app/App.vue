<template>
	<div id="App" class="App">
		<tm-player class="App__player"></tm-player>
		<tm-queue class="App__queue"></tm-queue>
	</div>
</template>

<style lang="less" scoped>
	.App {
		display: flex;
	}
	
	@media(max-width: 768px) {
		.App__queue {
			display: none;
		}
	}
</style>

<script>
	import TmPlayer from "./components/TmPlayer.vue";
	import TmQueue from "./components/TmQueue.vue";
	
	export default {
		components: {
			TmPlayer,
			TmQueue
		}
	};
</script>
