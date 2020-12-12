<script>
export let style="";
export let rowNum="";
let mRowNum="";
$: if(rowNum){
   mRowNum="-"+rowNum;
}
</script>

<div class="col{mRowNum}" style="{style}">
    <slot></slot>
</div>