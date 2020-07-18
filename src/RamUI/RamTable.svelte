<script>
  export let title = [];
  export let data = [];
  export let style = "";
</script>


<table class="table" style="{style}">
  {#if title.length > 0}
  <thead>
    <tr>
      {#each title as th}
        <th>{th}</th>
      {/each}
    </tr>
    </thead>
  {/if}
  <tbody>
      {#each data as td}
       <tr>
        <td>{td["id"]}</td>
        <td>{td["name"]}</td>
        <td>{td["age"]}</td>
        </tr>
      {/each}
  </tbody>
</table>

<style>
  .table {
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    border:0.1rem solid #2780E3;
  }
  .table thead th {
    background-color: #2780E3;
    color:#fff;
    padding:0.5rem 1rem;
  }
 .table th {
    padding:0.5rem 1rem;
    line-height: 1.2;
    border:0.1rem solid #2780E3;
  }
  .table td{
    padding:0.5rem 1rem;
  }
  .table tr:nth-child(odd) {
    background: #fff;
  }
  .table tr:nth-child(even) {
    background: #ccc;
  }
</style>


