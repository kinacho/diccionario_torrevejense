<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { Search, Heart, BarChart3, BookOpen, Shuffle, ArrowRight } from 'lucide-svelte';
  import { getSuggestions, getRandomWord } from '$lib/dictionary';
  
  let searchQuery = '';
  let suggestions: string[] = [];
  
  $: if (searchQuery.length >= 2) {
    suggestions = getSuggestions(searchQuery);
  } else {
    suggestions = [];
  }
  
  function handleSearch(e: Event) {
    if (searchQuery.trim()) {
      goto(`/buscar?q=${encodeURIComponent(searchQuery)}`);
      suggestions = [];
    }
  }

  function selectSuggestion(s: string) {
    goto(`/entrada/${encodeURIComponent(s)}`);
    searchQuery = '';
    suggestions = [];
  }

  function randomWord() {
    const word = getRandomWord();
    goto(`/entrada/${encodeURIComponent(word.headword)}`);
  }
</script>

<div class="min-h-screen flex flex-col">
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <a href="/" class="flex items-center space-x-2">
            <span class="text-2xl font-serif font-bold text-torrevieja-blue-700">Diccionario Torrevejense</span>
          </a>
        </div>

        {#if $page.url.pathname !== '/'}
          <div class="hidden md:flex flex-1 max-w-md mx-8">
            <form on:submit|preventDefault={handleSearch} class="relative w-full">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search class="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                bind:value={searchQuery}
                on:blur={() => setTimeout(() => suggestions = [], 200)}
                class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-torrevieja-blue-500 focus:border-torrevieja-blue-500 sm:text-sm transition-all"
                placeholder="Buscar palabra..."
              />
              
              {#if suggestions.length > 0}
                <div class="absolute z-50 w-full mt-10 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden text-left">
                  {#each suggestions as suggestion}
                    <button
                      on:click={() => selectSuggestion(suggestion)}
                      class="w-full px-4 py-2 hover:bg-torrevieja-blue-50 flex items-center justify-between group transition-colors text-sm"
                    >
                      <span class="text-slate-700">
                        <span class="font-bold">{searchQuery}</span>{suggestion.slice(searchQuery.length)}
                      </span>
                      <ArrowRight class="h-3 w-3 text-slate-300 group-hover:text-torrevieja-blue-500 transition-colors" />
                    </button>
                  {/each}
                </div>
              {/if}
            </form>
          </div>
        {:else}
          <div class="flex-1"></div>
        {/if}

        <nav class="flex items-center space-x-4">
          <button on:click={randomWord} class="p-2 text-slate-500 hover:text-torrevieja-blue-600 transition-colors" title="Palabra aleatoria">
            <Shuffle class="h-5 w-5" />
          </button>
          <a href="/favoritos" class="p-2 text-slate-500 hover:text-red-500 transition-colors" title="Favoritos">
            <Heart class="h-5 w-5" />
          </a>
          <a href="/estadisticas" class="p-2 text-slate-500 hover:text-torrevieja-blue-600 transition-colors" title="Estadísticas">
            <BarChart3 class="h-5 w-5" />
          </a>
          <a href="/abreviaturas" class="p-2 text-slate-500 hover:text-torrevieja-blue-600 transition-colors" title="Abreviaturas">
            <BookOpen class="h-5 w-5" />
          </a>
        </nav>
      </div>
    </div>
    
    <div class="bg-slate-50 border-t border-slate-200 py-2 overflow-x-auto">
      <div class="max-w-7xl mx-auto px-4 flex justify-center space-x-1 sm:space-x-2 text-sm font-medium text-slate-600">
        {#each 'ABCDEFGHIJLMNÑOPQRSTUVY'.split('') as letter}
          <a href="/letra/{letter}" class="px-2 py-1 hover:text-torrevieja-blue-600 hover:bg-white rounded transition-colors">
            {letter}
          </a>
        {/each}
      </div>
    </div>
  </header>

  <main class="flex-grow">
    <slot />
  </main>

  <footer class="bg-white border-t border-slate-200 py-8">
    <div class="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
      <p>© {new Date().getFullYear()} Diccionario Torrevejense Interactivo.</p>
      <div class="mt-2 space-x-4">
        <a href="/acerca" class="hover:text-torrevieja-blue-600 transition-colors">Acerca de</a>
        <a href="/abreviaturas" class="hover:text-torrevieja-blue-600 transition-colors">Abreviaturas</a>
      </div>
    </div>
  </footer>
</div>
