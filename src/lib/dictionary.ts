import dictionaryData from './data/dictionary.json';
import Fuse from 'fuse.js';

export interface DictionaryEntry {
  headword: string;
  category: string;
  fields: string[];
  has_etim: boolean;
  has_loc: boolean;
  has_sin: boolean;
  has_ant: boolean;
  letter: string;
  html: string;
  text: string;
}

const entries = dictionaryData as DictionaryEntry[];

// Initialize Fuse for fuzzy search
const fuse = new Fuse(entries, {
  keys: ['headword', 'text'],
  threshold: 0.3,
  ignoreLocation: true,
  includeScore: true
});

export function getAllEntries() {
  return entries;
}

export function getEntryByHeadword(headword: string) {
  const normalizedHeadword = headword.toLowerCase();
  return entries.find(e => e.headword.toLowerCase() === normalizedHeadword);
}

export function searchEntries(query: string, filters: any = {}) {
  if (!query && Object.keys(filters).length === 0) return [];
  
  let results = entries;

  if (query) {
    const fuseResults = fuse.search(query);
    results = fuseResults.map(r => r.item);
  }

  // Apply filters
  if (filters.letter) {
    results = results.filter(e => e.letter === filters.letter);
  }
  if (filters.category) {
    results = results.filter(e => e.category.includes(filters.category));
  }
  if (filters.field) {
    results = results.filter(e => e.fields.includes(filters.field));
  }
  if (filters.has_etim) results = results.filter(e => e.has_etim);
  if (filters.has_loc) results = results.filter(e => e.has_loc);
  if (filters.has_sin) results = results.filter(e => e.has_sin);
  if (filters.has_ant) results = results.filter(e => e.has_ant);

  return results;
}

export function getSuggestions(query: string) {
  if (query.length < 2) return [];
  const normalized = query.toLowerCase();
  return entries
    .filter(e => e.headword.toLowerCase().startsWith(normalized))
    .slice(0, 10)
    .map(e => e.headword);
}

export function getWordOfTheDay() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % entries.length;
  return entries[index];
}

export function getRandomWord() {
  const index = Math.floor(Math.random() * entries.length);
  return entries[index];
}

export function getEntriesByLetter(letter: string) {
  return entries.filter(e => e.letter === letter).sort((a, b) => a.headword.localeCompare(b.headword));
}

export function getStats() {
  const lettersCount: Record<string, number> = {};
  const fieldsCount: Record<string, number> = {};
  
  entries.forEach(e => {
    lettersCount[e.letter] = (lettersCount[e.letter] || 0) + 1;
    e.fields.forEach(f => {
      fieldsCount[f] = (fieldsCount[f] || 0) + 1;
    });
  });

  return {
    total: entries.length,
    lettersCount,
    fieldsCount,
    etimCount: entries.filter(e => e.has_etim).length,
    locCount: entries.filter(e => e.has_loc).length,
    sinCount: entries.filter(e => e.has_sin).length,
  };
}
