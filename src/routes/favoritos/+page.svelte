<script lang="ts">
  import { onMount } from 'svelte';
  import { getEntryByHeadword } from '$lib/dictionary';
  import { Heart, Trash2, ArrowRight } from 'lucide-svelte';

  let favorites: any[] = [];

  onMount(() => {
    loadFavorites();
  });

  function loadFavorites() {
    const favsList = JSON.parse(localStorage.getItem('favorites') || '[]');
    favorites = favsList.map((lema: string) => getEntryByHeadword(lema)).filter(Boolean);
  }

  function removeFavorite(lema: string) {
    let favsList = JSON.parse(localStorage.getItem('favorites') || '[]');
    favsList = favsList.filter((f: string) => f !== lema);
    localStorage.setItem('favorites', JSON.stringify(favsList));
    loadFavorites();
  }

  function clearFavorites() {
    if (confirm('¿Estás seguro de que quieres borrar todos tus favoritos?')) {
        localStorage.setItem('favorites', '[]');
        loadFavorites();
    }
  }
</script>

<svelte:head>
  <title>Mis Favoritos — Diccionario Torrevejense</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-12">
        <div>
            <h1 class="text-4xl font-serif font-bold text-slate-800">Mis Favoritos</h1>
            <p class="text-slate-500 mt-2">Tus palabras guardadas para consultar rápidamente.</p>
        </div>
        {#if favorites.length > 0}
            <button 
                on:click={clearFavorites}
                class="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
            >
                <Trash2 class="h-4 w-4" /> Borrar todo
            </button>
        {/if}
    </div>

    {#if favorites.length > 0}
        <div class="grid gap-4">
            {#each favorites as entry}
                <div class="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center shadow-sm hover:shadow-md transition-all">
                    <a href="/entrada/{entry.headword}" class="flex-grow">
                        <div class="flex items-center gap-3">
                            <h2 class="text-xl font-bold text-torrevieja-blue-800">{entry.headword}</h2>
                            <span class="text-xs italic text-slate-400">{entry.category}</span>
                        </div>
                        <p class="text-sm text-slate-500 mt-1 italic">{entry.text.split('. ').slice(1, 2)}</p>
                    </a>
                    <div class="flex items-center gap-4">
                        <button 
                            on:click={() => removeFavorite(entry.headword)}
                            class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                            title="Quitar de favoritos"
                        >
                            <Heart class="h-5 w-5 fill-red-500" />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="bg-white p-20 rounded-3xl border-2 border-dashed border-slate-100 text-center">
            <Heart class="h-12 w-12 text-slate-100 mx-auto mb-4" />
            <p class="text-slate-400">Aún no has guardado ninguna palabra favorita.</p>
            <a href="/" class="mt-6 inline-block text-torrevieja-blue-600 font-bold">Ir al buscador</a>
        </div>
    {/if}
</div>
