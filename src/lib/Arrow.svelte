<script lang="ts">let { direction='up' }:{direction?:'up'|'right'}=$props();</script>
<svg class="arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d={direction==='up'?'M5 15 15 5M5 5h10v10':'M4 10h12m-5-5 5 5-5 5'} stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
