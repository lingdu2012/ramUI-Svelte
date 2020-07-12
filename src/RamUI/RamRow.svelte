<script>

export let valign="middle";
export let align="center";
export let style="";

</script>

<div class="Grid -{valign} -{align}" style="{style}">
<slot>
</slot>
</div>


<style>
.Grid            { display: flex; flex-wrap: wrap;}
.Grid.\-top      { align-items: flex-start; }
.Grid.\-middle   { align-items: center; }
.Grid.\-bottom   { align-items: flex-end; }
.Grid.\-stretch  { align-items: stretch; }
.Grid.\-baseline { align-items: baseline; }
.Grid.\-left     { justify-content: flex-start; }
.Grid.\-center   { justify-content: center; }
.Grid.\-right    { justify-content: flex-end; }
.Grid.\-between  { justify-content: space-between; }
.Grid.\-around   { justify-content: space-around; }
</style>