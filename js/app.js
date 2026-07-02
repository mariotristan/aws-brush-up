const STORAGE_KEY = 'aws-brush-up-progress';

const AppProgress = {
  getCompleted() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  },

  isCompleted(day) {
    return this.getCompleted().includes(day);
  },

  completedCount() {
    return this.getCompleted().length;
  },

  toggle(day) {
    const completed = this.getCompleted();
    const idx = completed.indexOf(day);
    if (idx === -1) {
      completed.push(day);
    } else {
      completed.splice(idx, 1);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    document.dispatchEvent(new CustomEvent('progress-changed'));
  },
};
