<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { searchEntries, getRandomWord } from '$lib/dictionary';
  import { Search, Filter, ArrowRight, BookOpen } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let results: any[] = [];
  let query = '';
  let showFilters = false;
  
  let filters = {
    letter: '',
    category: '',
    field: '',
    has_etim: false,
    has_loc: false,
    has_sin: false,
    has_ant: false
  };

  $: {
    const q = $page.url.searchParams.get('q') || '';
    const random = $page.url.searchParams.get('random');
    
    if (random === 'true') {
        const word = getRandomWord();
        if (word) goto(`/entrada/${encodeURIComponent(word.headword)}`, { replaceState: true });
    } else {
        query = q;
        updateResults();
    }
  }

  function updateResults() {
    results = searchEntries(query, filters);
  }

  function toggleFilter(e: any) {
    updateResults();
  }
</script>

<svelte:head>
  <title>Resultados para "{query}" — Diccionario Torrevejense</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex flex-col md:flex-row gap-8">
    <!-- Sidebar Filters -->
    <aside class="w-full md:w-64 space-y-6">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 class="font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Filter class="h-4 w-4" /> Filtros
        </h2>
        
        <div class="space-y-4">
          <div>
            <label for="letter-filter" class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Letra</label>
            <select id="letter-filter" bind:value={filters.letter} on:change={updateResults} class="w-full rounded-lg border-slate-200 text-sm">
                <option value="">Todas</option>
                {#each 'ABCDEFGHIJLMNÑOPQRSTUVY'.split('') as l}
                    <option value={l}>{l}</option>
                {/each}
            </select>
          </div>

          <div>
            <span class="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Características</span>
            <div class="space-y-2">
                <label class="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" bind:checked={filters.has_etim} on:change={updateResults} class="rounded text-torrevieja-blue-600" />
                    Con etimología
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" bind:checked={filters.has_loc} on:change={updateResults} class="rounded text-torrevieja-blue-600" />
                    Con locuciones
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-600">
                    <input type="checkbox" bind:checked={filters.has_sin} on:change={updateResults} class="rounded text-torrevieja-blue-600" />
                    Con sinónimos
                </label>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Results Area -->
    <div class="flex-1">
      <div class="mb-6 flex justify-between items-center">
        <h1 class="text-xl text-slate-600">
          {#if query}
            Buscando <span class="font-bold text-slate-900">"{query}"</span>
          {:else}
            Explorando diccionario
          {/if}
          <span class="ml-2 text-sm text-slate-400">({results.length} entradas encontradas)</span>
        </h1>
      </div>

      {#if results.length > 0}
        <div class="grid gap-4">
          {#each results as entry}
            <a 
              href="/entrada/{entry.headword}"
              class="bg-white p-6 rounded-2xl border border-slate-200 hover:border-torrevieja-blue-300 hover:shadow-md transition-all group flex justify-between items-center"
            >
              <div>
                  <div class="flex items-center gap-3 mb-1">
                    <h2 class="text-lg font-bold text-torrevieja-blue-800">{entry.headword}</h2>
                    <span class="text-xs italic text-slate-400">{entry.category}</span>
                  </div>
                  <p class="text-sm text-slate-600 line-clamp-2">
                    {entry.text.split('. ').slice(1, 3).join('. ')}
                  </p>
                  <div class="flex flex-wrap gap-2 mt-3">
                    {#each entry.fields as field}
                        <span class="px-2 py-0.5 bg-slate-100 text-[10px] font-bold text-slate-500 rounded uppercase tracking-tighter">
                            {field}
                        </span>
                    {/each}
                  </div>
              </div>
              <ArrowRight class="h-5 w-5 text-slate-300 group-hover:text-torrevieja-blue-600 group-hover:translate-x-1 transition-all" />
            </a>
          {/each}
        </div>
      {:else}
        <div class="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center">
          <BookOpen class="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-slate-600">No hay resultados</h3>
          <p class="text-slate-400 mt-2">Prueba con otros términos de búsqueda o filtros.</p>
        </div>
      {/if}
    </div>
  </div>
</div>
