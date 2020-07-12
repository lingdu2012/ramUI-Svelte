<script>
   export let rowNum=1;
   export let style="";
</script>


<div class="Cell -{rowNum}of12" style="{style}">
<slot></slot>
</div>

<style>
.Cell            { box-sizing: border-box; flex-shrink: 0; }
.Cell.\-fill     { width: 0; min-width: 0; flex-grow: 1; }
.Cell.\-1of12    { width: calc(100% * 1 / 12); }
.Cell.\-2of12    { width: calc(100% * 2 / 12); }
.Cell.\-3of12    { width: calc(100% * 3 / 12); }
.Cell.\-4of12    { width: calc(100% * 4 / 12); }
.Cell.\-5of12    { width: calc(100% * 5 / 12); }
.Cell.\-6of12    { width: calc(100% * 6 / 12); }
.Cell.\-7of12    { width: calc(100% * 7 / 12); }
.Cell.\-8of12    { width: calc(100% * 8 / 12); }
.Cell.\-9of12    { width: calc(100% * 9 / 12); }
.Cell.\-10of12   { width: calc(100% * 10 / 12); }
.Cell.\-11of12   { width: calc(100% * 11 / 12); }
.Cell.\-12of12   { width: 100%; }
</style>