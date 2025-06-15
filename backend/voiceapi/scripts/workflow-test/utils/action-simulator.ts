import { Action } from '../types';
import { Logger } from './logger';
import { DEFAULT_CONFIG } from '../config';

export class ActionSimulator {
  static async simulateUserInteractions(
    actions: Action[],
    updateActionCallback: (actionId: string, status: Action['status']) => Promise<void>
  ): Promise<void> {
    Logger.log(`🎭 Simulating user interactions for ${actions.length} actions`);

    for (const action of actions) {
      const newStatus = this.determineActionStatus(action);
      
      await updateActionCallback(action.id, newStatus);
      
      // Small delay between updates to simulate realistic user behavior
      await this.delay(DEFAULT_CONFIG.ACTION_UPDATE_DELAY_MS);
    }
  }

  private static determineActionStatus(action: Action): Action['status'] {
    // Simulate different user interaction patterns based on action type
    switch (action.type) {
      case 'todo':
        // 50% chance to accept, 50% chance to complete immediately
        return Math.random() > 0.5 ? 'accepted' : 'completed';
      
      case 'calendar':
        // Calendar items are usually accepted (90% chance)
        return Math.random() > 0.1 ? 'accepted' : 'deleted';
      
      case 'research':
        // Research items have varied outcomes: 60% accepted, 30% deleted, 10% completed
        const rand = Math.random();
        if (rand > 0.7) return 'deleted';
        if (rand > 0.1) return 'accepted';
        return 'completed';
      
      default:
        return 'accepted';
    }
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getActionStatusDistribution(actions: Action[]): Record<Action['status'], number> {
    const distribution: Record<Action['status'], number> = {
      created: 0,
      accepted: 0,
      deleted: 0,
      completed: 0,
    };

    actions.forEach(action => {
      distribution[action.status]++;
    });

    return distribution;
  }

  static logActionSummary(actions: Action[]): void {
    const distribution = this.getActionStatusDistribution(actions);
    const typeDistribution = actions.reduce((acc, action) => {
      acc[action.type] = (acc[action.type] || 0) + 1;
      return acc;
    }, {} as Record<Action['type'], number>);

    Logger.info('Action Summary:', {
      total: actions.length,
      byStatus: distribution,
      byType: typeDistribution,
    });
  }
}
