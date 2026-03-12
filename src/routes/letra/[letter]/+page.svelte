<script lang="ts">
  import { page } from '$app/stores';
  import { getEntriesByLetter } from '$lib/dictionary';
  import { ArrowRight, Search } from 'lucide-svelte';

  $: letter = $page.params.letter;
  $: entries = getEntriesByLetter(letter);
  
  let filterQuery = '';
  $: filteredEntries = entries.filter(e => e.headword.toLowerCase().includes(filterQuery.toLowerCase()));
</script>

<svelte:head>
  <title>Palabras que empiezan por {letter} — Diccionario Torrevejense</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
            <h1 class="text-6xl font-serif font-bold text-torrevieja-blue-800 uppercase leading-none">
                Letra {letter}
            </h1>
            <p class="mt-4 text-slate-500">
                Mostrando {filteredEntries.length} entradas de la letra {letter}.
            </p>
        </div>
        
        <div class="relative w-full md:w-64">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
                type="text" 
                bind:value={filterQuery}
                placeholder="Filtrar en esta letra..."
                class="w-full pl-10 pr-4 py-2 border-slate-200 rounded-xl text-sm focus:ring-torrevieja-blue-500 focus:border-torrevieja-blue-500"
            />
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredEntries as entry}
            <a 
                href="/entrada/{entry.headword}"
                class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-torrevieja-blue-200 transition-all group"
            >
                <div class="flex items-center justify-between mb-2">
                    <h2 class="text-xl font-bold text-slate-800 group-hover:text-torrevieja-blue-700 transition-colors">
                        {entry.headword}
                    </h2>
                    <span class="text-xs italic text-slate-400">{entry.category}</span>
                </div>
                <p class="text-sm text-slate-500 line-clamp-2 italic">
                    {entry.text.split('. ').slice(1, 2).join('. ')}
                </p>
            </a>
        {/each}
    </div>
    
    {#if filteredEntries.length === 0}
        <div class="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-100 text-center">
            <p class="text-slate-400">No se han encontrado palabras que coincidan con el filtro.</p>
        </div>
    {/if}
</div>
