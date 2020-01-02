<template>
	<div class="TmPlayerYoutube">
		<div id="Player"></div>
	</div>
</template>

<script>
	export default {
		methods: {
			onStateChange() {
				
			}
		},
		
		mounted() {
			this.player = new YT.Player('player', {
				width: '1920',
				height: '1080',
				events: {
					onStateChange() {
						this.onStateChange();
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
