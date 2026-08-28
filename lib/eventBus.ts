export type CampusEventType = 
  | 'ACADEMIC_ANNOUNCEMENT' 
  | 'EMERGENCY_BROADCAST' 
  | 'IOT_TELEMETRY' 
  | 'TURNSTILE_ACCESS' 
  | 'DISPENSARY_ALERT' 
  | 'SPORTS_RESERVATION';

export interface CampusLiveEvent {
  id: string;
  type: CampusEventType;
  title: string;
  description: string;
  timestamp: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  metadata?: Record<string, any>;
}

type EventListener = (event: CampusLiveEvent) => void;

class CampusEventBus {
  private listeners: Map<CampusEventType | 'ALL', Set<EventListener>> = new Map();

  public subscribe(eventType: CampusEventType | 'ALL', callback: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  public publish(event: CampusLiveEvent): void {
    // Notify specific subscribers
    const specific = this.listeners.get(event.type);
    if (specific) {
      specific.forEach(cb => cb(event));
    }

    // Notify ALL subscribers
    const all = this.listeners.get('ALL');
    if (all) {
      all.forEach(cb => cb(event));
    }
  }
}

export const campusEventBus = new CampusEventBus();
