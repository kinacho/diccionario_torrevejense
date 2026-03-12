<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getEntryByHeadword, getAllEntries } from '$lib/dictionary';
  import { Heart, Share2, ArrowLeft, ArrowRight, ChevronLeft, Info } from 'lucide-svelte';
  import { onMount } from 'svelte';

  $: lema = $page.params.lema as string;
  $: entry = getEntryByHeadword(lema);
  
  let isFavorite = false;
  let allEntries = getAllEntries();
  $: currentIndex = allEntries.findIndex(e => e.headword === entry?.headword);
  $: prevEntry = currentIndex > 0 ? allEntries[currentIndex - 1] : null;
  $: nextEntry = currentIndex < allEntries.length - 1 ? allEntries[currentIndex + 1] : null;

  onMount(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    isFavorite = favorites.includes(lema);
    
    // Track history
    let history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    if (!history.includes(lema)) {
      history.unshift(lema);
      if (history.length > 20) history.pop();
      localStorage.setItem('searchHistory', JSON.stringify(history));
    }
  });

  function toggleFavorite() {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      favorites = favorites.filter((f: string) => f !== lema);
    } else {
      favorites.push(lema);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    isFavorite = !isFavorite;
  }

  async function shareEntry() {
    const shareData = {
      title: `${entry?.headword} — Diccionario Torrevejense`,
      text: `"${entry?.headword}" en el Diccionario Torrevejense.`,
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
      }
    } catch (err) {
      console.error(err);
    }
  }

  let articleElement: HTMLElement;

  // Function to mark spans that are valid entries in the dictionary
  function markValidReferences() {
    if (!articleElement) return;
    const spans = articleElement.querySelectorAll('span');
    spans.forEach(span => {
      // Clean up text for dictionary lookup (remove superscripts and trailing punctuation)
      const text = (span as HTMLElement).innerText.trim()
        .replace(/[0-9]/g, '')
        .replace(/[.,;:]+$/, '');
      
      if (text && text.toLowerCase() !== lema.toLowerCase() && getEntryByHeadword(text)) {
        // If it's a valid headword, mark it as clickable
        span.classList.add('clickable-ref');
      }
    });
  }

  // Reactive block to trigger marking when entry or DOM changes
  $: if (entry && articleElement) {
    // Small timeout to ensure @html has finished rendering
    setTimeout(markValidReferences, 10);
  }

  // Handle cross-references in HTML
  function handleHtmlClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    
    // Check if the element was marked as a valid reference
    if (target.classList.contains('clickable-ref')) {
        const word = target.innerText.trim().replace(/[0-9]/g, '');
        goto(`/entrada/${word}`);
    }
  }
</script>

<svelte:head>
  <title>{entry ? `${entry.headword} — Diccionario Torrevejense` : 'Cargando... — Diccionario Torrevejense'}</title>
  <meta name="description" content={entry ? entry.text.slice(0, 160) : 'Entrada del diccionario torrevejense'} />
</svelte:head>

{#if entry}

  <div class="max-w-4xl mx-auto px-4 py-8">
    <nav class="flex justify-between items-center mb-8">
      <a href="/" class="flex items-center text-slate-500 hover:text-torrevieja-blue-600 transition-colors">
        <ChevronLeft class="h-5 w-5" />
        Volver al buscador
      </a>
      <div class="flex space-x-2">
        <button 
          on:click={toggleFavorite}
          class="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors {isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400'}"
        >
          <Heart class="h-5 w-5" />
        </button>
        <button 
          on:click={shareEntry}
          class="p-2 rounded-full border border-slate-200 hover:bg-slate-50 transition-colors text-slate-400"
        >
          <Share2 class="h-5 w-5" />
        </button>
      </div>
    </nav>

    <article class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-4">
            <a href="/abreviaturas" title="Ver abreviaturas" class="text-slate-300 hover:text-torrevieja-blue-400">
                <Info class="h-6 w-6" />
            </a>
        </div>
      <div 
        class="article-content" 
        bind:this={articleElement}
        on:click={handleHtmlClick}
      >
        {@html entry.html}
      </div>
    </article>

    <div class="mt-8 grid grid-cols-2 gap-4">
        {#if prevEntry}
          <a href="/entrada/{prevEntry.headword}" class="flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-torrevieja-blue-300 transition-all group">
            <span class="text-xs text-slate-400 flex items-center gap-1 group-hover:-translate-x-1 transition-transform">
                <ArrowLeft class="h-3 w-3" /> Anterior
            </span>
            <span class="font-bold text-slate-700">{prevEntry.headword}</span>
          </a>
        {:else}
          <div></div>
        {/if}
        
        {#if nextEntry}
          <a href="/entrada/{nextEntry.headword}" class="flex flex-col p-4 bg-white border border-slate-200 rounded-xl hover:border-torrevieja-blue-300 transition-all group text-right">
            <span class="text-xs text-slate-400 flex items-center gap-1 justify-end group-hover:translate-x-1 transition-transform">
                Siguiente <ArrowRight class="h-3 w-3" />
            </span>
            <span class="font-bold text-slate-700">{nextEntry.headword}</span>
          </a>
        {/if}
    </div>
  </div>
{:else}
  <div class="max-w-4xl mx-auto px-4 py-20 text-center">
    <h1 class="text-2xl font-bold text-slate-800">Entrada no encontrada</h1>
    <p class="mt-4 text-slate-600">Lo sentimos, no hemos podido encontrar la palabra solicitada.</p>
    <a href="/" class="mt-8 inline-block bg-torrevieja-blue-600 text-white px-6 py-2 rounded-lg">Volver al inicio</a>
  </div>
{/if}

<style>
    :global(.article-content big) {
        @apply text-5xl font-serif text-torrevieja-blue-800 mb-6 border-b border-slate-100 pb-4 inline-block w-full;
    }
    :global(.article-content span[style*="font-style: italic"]) {
        @apply text-slate-500 italic;
    }
    :global(.article-content b, .article-content strong) {
        @apply font-bold text-slate-800;
    }
    :global(.article-content span) {
        @apply transition-colors;
    }
    /* Style ONLY validated clickable references */
    :global(.article-content .clickable-ref) {
        @apply cursor-pointer text-torrevieja-blue-600 underline font-bold transition-all decoration-torrevieja-blue-200 underline-offset-4 hover:text-torrevieja-blue-800 hover:decoration-torrevieja-blue-500;
    }
</style>
