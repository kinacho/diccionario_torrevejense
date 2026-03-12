<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getWordOfTheDay, getSuggestions } from "$lib/dictionary";
  import { Search, Shuffle, ArrowRight, BookOpen } from "@lucide/svelte";

  let searchQuery = "";
  let suggestions: string[] = [];
  let wotd = getWordOfTheDay();

  $: if (searchQuery.length >= 2) {
    suggestions = getSuggestions(searchQuery);
  } else {
    suggestions = [];
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      goto(`/buscar?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  function selectSuggestion(s: string) {
    goto(`/entrada/${encodeURIComponent(s)}`);
  }
</script>

<svelte:head>
  <title>Diccionario Torrevejense — El habla de Torrevieja</title>
  <meta
    name="description"
    content="Diccionario interactivo del habla torrevejense. Más de 1.300 entradas con etimologías, locuciones y ejemplos."
  />
</svelte:head>

<div class="bg-gradient-to-b from-torrevieja-blue-50 to-white pt-16 pb-24">
  <div class="max-w-4xl mx-auto px-4 text-center">
    <h1
      class="text-5xl md:text-7xl font-serif font-bold text-torrevieja-blue-900 mb-6 animate-fade-in"
    >
      Habla Torrevejense
    </h1>
    <p class="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
      Descubre la riqueza del léxico local: desde el lenguaje de las salinas
      hasta las voces del mar.
    </p>

    <div class="relative max-w-2xl mx-auto mb-16">
      <form on:submit|preventDefault={handleSearch} class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
        >
          <Search class="h-6 w-6 text-slate-400" />
        </div>
        <input
          type="text"
          bind:value={searchQuery}
          on:blur={() => setTimeout(() => (suggestions = []), 200)}
          class="block w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-2xl leading-5 bg-white shadow-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-torrevieja-blue-500 focus:border-torrevieja-blue-500 text-lg transition-all"
          placeholder="Escribe una palabra (p. ej. abajote, abonico...)"
        />
        <button
          type="submit"
          class="absolute inset-y-2 right-2 px-6 bg-torrevieja-blue-600 text-white rounded-xl font-medium hover:bg-torrevieja-blue-700 transition-colors"
        >
          Buscar
        </button>
      </form>

      {#if suggestions.length > 0}
        <div
          class="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-left"
        >
          {#each suggestions as suggestion}
            <button
              on:click={() => selectSuggestion(suggestion)}
              class="w-full px-4 py-3 hover:bg-torrevieja-blue-50 flex items-center justify-between group transition-colors"
            >
              <span class="text-slate-700">
                <span class="font-bold">{searchQuery}</span>{suggestion.slice(
                  searchQuery.length,
                )}
              </span>
              <ArrowRight
                class="h-4 w-4 text-slate-300 group-hover:text-torrevieja-blue-500 transition-colors"
              />
            </button>
          {/each}
        </div>
      {/if}
    </div>

    <div class="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
      <span>Tendencias:</span>
      {#each ["abajote", "abonico", "achavo", "milocha", "salinero"] as word}
        <a
          href="/entrada/{word}"
          class="text-torrevieja-blue-600 hover:underline">{word}</a
        >
      {/each}
    </div>
  </div>
</div>

<div class="max-w-4xl mx-auto px-4 -mt-20 relative z-10 pb-20">
  <div
    class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100"
  >
    <div
      class="bg-torrevieja-blue-600 px-8 py-4 flex items-center justify-between"
    >
      <h2 class="text-white font-bold flex items-center gap-2">
        <BookOpen class="h-5 w-5" />
        Palabra del día
      </h2>
      <span class="text-torrevieja-blue-100 text-sm">
        {new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
        })}
      </span>
    </div>
    <div class="p-8">
      <div class="article-content">
        {@html wotd.html}
      </div>
      <div class="mt-8 flex justify-end">
        <a
          href="/entrada/{wotd.headword}"
          class="text-torrevieja-blue-600 font-bold flex items-center gap-1 hover:gap-2 transition-all"
        >
          Ver entrada completa <ArrowRight class="h-5 w-5" />
        </a>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
</style>
