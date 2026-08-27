/**
 * CampusHub AI - Offline Data Synchronization Engine
 * Manages queued offline mutation actions and synchronizes them when the network reconnects.
 */

export interface OfflineAction {
  id: string;
  url: string;
  method: string;
  body: any;
  queuedAt: string;
}

class OfflineSyncEngine {
  private queueKey = 'campushub_offline_queue';

  public getQueue(): OfflineAction[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.queueKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public enqueue(action: Omit<OfflineAction, 'id' | 'queuedAt'>): OfflineAction {
    const item: OfflineAction = {
      id: `OFF-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: action.url,
      method: action.method,
      body: action.body,
      queuedAt: new Date().toISOString()
    };

    const current = this.getQueue();
    current.push(item);

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.queueKey, JSON.stringify(current));
    }

    return item;
  }

  public clearQueue() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.queueKey);
    }
  }

  public async syncQueue(): Promise<{ synced: number; failed: number }> {
    const queue = this.getQueue();
    if (queue.length === 0) return { synced: 0, failed: 0 };

    let synced = 0;
    let failed = 0;
    const remaining: OfflineAction[] = [];

    for (const action of queue) {
      try {
        const res = await fetch(action.url, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.body)
        });
        if (res.ok) {
          synced++;
        } else {
          failed++;
          remaining.push(action);
        }
      } catch {
        failed++;
        remaining.push(action);
      }
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.queueKey, JSON.stringify(remaining));
    }

    return { synced, failed };
  }
}

export const offlineSyncEngine = new OfflineSyncEngine();
