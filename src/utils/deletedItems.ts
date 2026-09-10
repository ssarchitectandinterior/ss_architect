const DELETED_PROJECTS_KEY = 'ss_deleted_projects';
const DELETED_JOURNALS_KEY = 'ss_deleted_journals';

export function getDeletedProjectIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_PROJECTS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set();
  }
}

export function addDeletedProjectId(id: string): void {
  try {
    const set = getDeletedProjectIds();
    set.add(id);
    localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to save deleted project ID:', e);
  }
}

export function getDeletedJournalIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DELETED_JOURNALS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch (e) {
    return new Set();
  }
}

export function addDeletedJournalId(id: string): void {
  try {
    const set = getDeletedJournalIds();
    set.add(id);
    localStorage.setItem(DELETED_JOURNALS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.error('Failed to save deleted journal ID:', e);
  }
}
