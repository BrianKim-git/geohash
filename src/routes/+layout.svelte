<script>
	import 'bootstrap/dist/css/bootstrap.min.css';
	import { page } from '$app/stores';  

	export let data;
  	$: path = $page.url.pathname;
  	$: user = data.user;
    
</script>

{#if user}
	<p>환영합니다, {user.email}!</p>
  	<nav>
		<a href="/">base</a>
		<a href="/map">map</a>
		<a href="/mapTest">mapTest</a>
		<a href="/signout">signout</a>
	</nav>
	<slot></slot>
{:else}
	{#if path === '/login' || path === '/signup'}
		<slot></slot>
	{:else}
		<a href="/login">
			<p>로그인해주세요.</p>
		</a>
	{/if}
{/if}