<script>
	let { size, color = '#ccc' } = $props();
	let border = Math.ceil(size / 9);
</script>

<span class="loader" style="--size: {size}px; --border: {border}px; --color: {color};"></span>

<style>
	.loader {
		width: var(--size);
		height: var(--size);
		border: var(--border) solid var(--color);
		border-radius: 50%;
		border-bottom-color: transparent;
		display: inline-block;
		box-sizing: border-box;
		vertical-align: sub;
		animation: rotation 1s linear infinite;
	}
	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
