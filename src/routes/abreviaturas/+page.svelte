<script lang="ts">
  const abbreviations = [
    { abr: "adj.", def: "adjetivo" },
    { abr: "adv.", def: "adverbio" },
    { abr: "Agr.", def: "Agricultura" },
    { abr: "ANT", def: "antónimo" },
    { abr: "Bot.", def: "Botánica" },
    { abr: "Coc.", def: "Cocina" },
    { abr: "Entom.", def: "Entomología" },
    { abr: "ETIM", def: "etimología" },
    { abr: "f.", def: "femenino" },
    { abr: "fig.", def: "figurado" },
    { abr: "Fin.", def: "Finanzas" },
    { abr: "Folk.", def: "Folclore" },
    { abr: "frs.", def: "frase" },
    { abr: "interj.", def: "interjección" },
    { abr: "irón.", def: "irónico" },
    { abr: "Jueg.", def: "Juegos" },
    { abr: "LGen.", def: "Lenguaje General" },
    { abr: "loc.", def: "locución" },
    { abr: "m.", def: "masculino" },
    { abr: "Mec.", def: "Mecánica" },
    { abr: "Med.", def: "Medicina" },
    { abr: "mur.", def: "murcianismo" },
    { abr: "n.", def: "nombre" },
    { abr: "Náut.", def: "Náutica" },
    { abr: "Pesc.", def: "Pesca" },
    { abr: "pl.", def: "plural" },
    { abr: "prnl.", def: "pronominal" },
    { abr: "Salin.", def: "Salinas" },
    { abr: "SIN", def: "sinónimo" },
    { abr: "TMB", def: "también" },
    { abr: "tr.", def: "transitivo" },
    { abr: "v.", def: "verbo" },
    { abr: "val.", def: "valencianismo" },
    { abr: "vul.", def: "vulgarismo" },
    { abr: "Zool.", def: "Zoología" }
  ];
</script>

<svelte:head>
  <title>Abreviaturas y Marcas — Diccionario Torrevejense</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-12">
    <div class="mb-12">
        <h1 class="text-4xl font-serif font-bold text-slate-800 mb-4">Abreviaturas y Marcas</h1>
        <p class="text-slate-500">
            Guía de las abreviaturas y marcas técnicas utilizadas en las definiciones del diccionario.
        </p>
    </div>

    <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left">
            <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <th class="px-8 py-4">Abreviatura</th>
                    <th class="px-8 py-4">Significado</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                {#each abbreviations as item}
                    <tr class="hover:bg-torrevieja-blue-50 transition-colors group">
                        <td class="px-8 py-4 font-bold text-torrevieja-blue-700 italic">{item.abr}</td>
                        <td class="px-8 py-4 text-slate-600">{item.def}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
</div>
