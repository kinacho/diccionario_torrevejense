<script lang="ts">
    import { getStats } from "$lib/dictionary";
    import { BarChart3, PieChart, Database, List } from "@lucide/svelte";

    const stats = getStats();

    // Sort fields by count
    const sortedFields = Object.entries(stats.fieldsCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

    const maxFieldCount = Math.max(...sortedFields.map(([, count]) => count));
</script>

<svelte:head>
    <title>Estadísticas del Corpus — Diccionario Torrevejense</title>
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-12">
    <div class="text-center mb-16">
        <h1 class="text-4xl font-serif font-bold text-slate-800 mb-4">
            Estadísticas del Corpus
        </h1>
        <p class="text-slate-500 max-w-2xl mx-auto">
            Análisis visual de las más de 1.300 entradas recopiladas en este
            diccionario interactivo del habla de Torrevieja.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div
            class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
        >
            <div
                class="p-4 bg-torrevieja-blue-50 text-torrevieja-blue-600 rounded-2xl"
            >
                <Database class="h-8 w-8" />
            </div>
            <div>
                <span class="block text-3xl font-bold text-slate-800"
                    >{stats.total}</span
                >
                <span class="text-sm text-slate-400">Entradas totales</span>
            </div>
        </div>
        <div
            class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
        >
            <div class="p-4 bg-pink-50 text-pink-500 rounded-2xl">
                <PieChart class="h-8 w-8" />
            </div>
            <div>
                <span class="block text-3xl font-bold text-slate-800"
                    >{stats.etimCount}</span
                >
                <span class="text-sm text-slate-400">Etimologías</span>
            </div>
        </div>
        <div
            class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
        >
            <div class="p-4 bg-amber-50 text-amber-500 rounded-2xl">
                <BarChart3 class="h-8 w-8" />
            </div>
            <div>
                <span class="block text-3xl font-bold text-slate-800"
                    >{stats.locCount}</span
                >
                <span class="text-sm text-slate-400">Locuciones</span>
            </div>
        </div>
        <div
            class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-6"
        >
            <div class="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                <List class="h-8 w-8" />
            </div>
            <div>
                <span class="block text-3xl font-bold text-slate-800"
                    >{stats.sinCount}</span
                >
                <span class="text-sm text-slate-400">Sinónimos</span>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Letters Distribution -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 class="font-bold text-slate-800 mb-8 flex items-center gap-2">
                Distribución por Letra
            </h2>
            <div class="h-64 flex items-end justify-between gap-1">
                {#each Object.entries(stats.lettersCount).sort() as [letter, count]}
                    <div class="flex-1 flex flex-col items-center gap-2 group">
                        <div class="relative w-full">
                            <div
                                class="w-full bg-torrevieja-blue-400 rounded-t-sm group-hover:bg-torrevieja-blue-600 transition-colors"
                                style="height: {(count / 150) * 100}%"
                            ></div>
                            <div
                                class="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] px-1 rounded transition-opacity"
                            >
                                {count}
                            </div>
                        </div>
                        <span class="text-[10px] font-bold text-slate-300"
                            >{letter}</span
                        >
                    </div>
                {/each}
            </div>
        </div>

        <!-- Fields Distribution -->
        <div class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 class="font-bold text-slate-800 mb-8 flex items-center gap-2">
                Campos Temáticos Populares
            </h2>
            <div class="space-y-4">
                {#each sortedFields as [field, count]}
                    <div class="space-y-1">
                        <div class="flex justify-between text-sm">
                            <span class="font-medium text-slate-600"
                                >{field}</span
                            >
                            <span class="text-slate-400">{count}</span>
                        </div>
                        <div
                            class="w-full bg-slate-100 h-2 rounded-full overflow-hidden"
                        >
                            <div
                                class="bg-torrevieja-blue-500 h-full rounded-full"
                                style="width: {(count / maxFieldCount) * 100}%"
                            ></div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>
