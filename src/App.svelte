<script>
	export let name;
	import RamRow from '../src/RamUI/RamRow.svelte';
	import RamCell from '../src/RamUI/RamCell.svelte';
	import RamButton from '../src/RamUI/RamButton.svelte';
	import RamCard from '../src/RamUI/RamCard.svelte';

	import RamDialog from '../src/RamUI/RamDialog.svelte';

	function handleClick() {
		alert('clicked');
	}
	function myclick() {
		alert('clicked22');
	}
	let dshow=false;
	function handleDialog(){
		dshow=true;
		console.log("dshow:"+dshow);
	}
	function closeDialog(){
    	dshow=false;
	}
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Hello {name}!</h1>
<RamRow {...{valign:"top",align:"center",style:"border:1px solid red;"}}>
	<RamCell rowNum={2}>hello</RamCell>
	<RamCell {...{rowNum:3,style:"border:1px solid green"}}>world</RamCell>
</RamRow>
<RamRow style={"margin-top:1rem;"}>
	<RamCell rowNum={12} style="text-align:center">
		<RamButton {...{btn:"primary"}} on:click={handleClick}/>
		<RamButton {...{btn:"danger"}} on:click={myclick}/>
		<RamButton {...{btn:"link"}}/>
		<RamButton {...{btn:"primary-outline"}} on:click={handleClick}/>
		<RamButton {...{btn:"danger-outline"}} on:click={myclick}/>
	</RamCell>
</RamRow>
<RamCard {...{title:"卡片标题",mark:"这是说明"}}>
	<RamRow {...{valign:"top",align:"center",style:"margin-top:1rem;"}}>
		<RamCell rowNum={2}>hello</RamCell>
		<RamCell {...{rowNum:3}}>world</RamCell>
	</RamRow>
</RamCard>
<RamButton {...{btn:"primary",txt:"打开对话框",style:"margin-top:3rem;"}} on:click={handleDialog}/>
<RamDialog  bind:show={dshow}>

</RamDialog>