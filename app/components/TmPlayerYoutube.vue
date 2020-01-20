<template>
	<div class="TmPlayerYoutube">
		<div id="Player"></div>
	</div>
</template>

<style lang="less">
	.TmPlayerYoutube {
		height: 100%;
		
		iframe {
			width: 100%;
			height: 100%;
		}
	}
</style>

<script>
	export default {
		props: {
			id: {
				type: String
			}
		},

		methods: {
			onStateChange(event) {
				if(event.data === 0)
					this.$emit('end');
			}
		},
		
		mounted() {
			this.player = new YT.Player('Player', {
				width: '1920',
				height: '1080',
				events: {
					onStateChange: (evt) => {
						this.onStateChange(evt);
					},

					onReady: () => {
						this.player.loadVideoById(this.id, 0, 'hd1080');
						this.player.playVideo();
					}
				}
			});
		},
		
		watch: {
			id(value) {
				this.player.loadVideoById(value, 0, 'hd1080');
				this.player.playVideo();
			}
		}
	};
</script>
