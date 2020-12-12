<script>
    export let exClass="";
    export let data=[];
    export let ths;
    export let cols;
</script>

<table class="table {exClass}">
  <slot name="thead">
        {#if ths}
            <thead>
                <tr>
                    {#each ths as item}
                        <th>{item}</th>
                    {/each}
                </tr>
            </thead>
        {/if}
  </slot>
  <slot name="tbody">
        {#if data}
        <tbody>
            {#each data as child}
                <tr>
                    {#each cols as item}
                        <td>{child[item]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
        {/if}
  </slot>
</table>