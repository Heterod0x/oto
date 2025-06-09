import { v4 as uuidv4 } from 'uuid';
import { TestConfig, TestResults, Action } from './types';
import { Logger } from './utils/logger';
import { ActionSimulator } from './utils/action-simulator';
import { ApiClient } from './services/api-client';
import { WebSocketClient } from './services/websocket-client';
import { DEFAULT_CONFIG } from './config';

export class WorkflowTester {
  private conversationId: string;
  private apiClient: ApiClient;
  private wsClient: WebSocketClient;

  constructor(private config: TestConfig) {
    this.conversationId = uuidv4();
    this.apiClient = new ApiClient(config);
    this.wsClient = new WebSocketClient(config);
  }

  async runWorkflowTest(): Promise<TestResults> {
    try {
      Logger.log('🚀 Starting Voice API Workflow Test');
      Logger.log(`📝 Conversation ID: ${this.conversationId}`);
      
      // Step 1: Audio Streaming
      await this.executeAudioStreamingStep();
      
      // Step 2: List Detected Actions
      const actions = await this.executeListActionsStep();
      
      // Step 3: Update Action Statuses
      await this.executeUpdateActionsStep(actions);
      
      // Step 4: Retrieve Final Data
      await this.executeRetrieveFinalDataStep();
      
      // Generate test results
      const results = this.generateTestResults(actions, true);
      this.logTestSummary(results);
      
      return results;
      
    } catch (error) {
      Logger.error('Workflow test failed:', error);
      const results = this.generateTestResults([], false, (error as Error).message);
      return results;
    }
  }

  private async executeAudioStreamingStep(): Promise<void> {
    Logger.section('STEP 1: Audio Streaming');
    await this.wsClient.simulateAudioStreaming(this.conversationId);
    
    // Wait for processing
    Logger.log(`⏳ Waiting ${DEFAULT_CONFIG.PROCESSING_DELAY_MS}ms for server processing...`);
    await this.delay(DEFAULT_CONFIG.PROCESSING_DELAY_MS);
  }

  private async executeListActionsStep(): Promise<Action[]> {
    Logger.section('STEP 2: List Detected Actions');
    const actions = await this.apiClient.listActions(this.conversationId);
    ActionSimulator.logActionSummary(actions);
    return actions;
  }

  private async executeUpdateActionsStep(actions: Action[]): Promise<void> {
    Logger.section('STEP 3: Update Action Statuses');
    
    if (actions.length === 0) {
      Logger.info('No actions to update');
      return;
    }

    await ActionSimulator.simulateUserInteractions(
      actions,
      (actionId, status) => this.apiClient.updateActionStatus(actionId, status)
    );
  }

  private async executeRetrieveFinalDataStep(): Promise<void> {
    Logger.section('STEP 4: Retrieve Final Data');
    
    // Try to retrieve all final data, but don't fail if some endpoints aren't ready
    const retrievalPromises = [
      this.safelyRetrieveTranscript(),
      this.safelyRetrieveAudioUrl(),
      this.safelyRetrieveLogs(),
    ];

    await Promise.allSettled(retrievalPromises);
  }

  private async safelyRetrieveTranscript(): Promise<void> {
    try {
      await this.apiClient.getConversationTranscript(this.conversationId);
    } catch (error) {
      // Non-critical error, just log it
    }
  }

  private async safelyRetrieveAudioUrl(): Promise<void> {
    try {
      await this.apiClient.getConversationAudioUrl(this.conversationId);
    } catch (error) {
      // Non-critical error, just log it
    }
  }

  private async safelyRetrieveLogs(): Promise<void> {
    try {
      await this.apiClient.getConversationLogs(this.conversationId);
    } catch (error) {
      // Non-critical error, just log it
    }
  }

  private generateTestResults(actions: Action[], success: boolean, error?: string): TestResults {
    const finalTranscript = this.wsClient.getFinalTranscript();
    
    return {
      conversationId: this.conversationId,
      actionsDetected: actions.length,
      finalTranscriptLength: finalTranscript.length,
      success,
      error,
    };
  }

  private logTestSummary(results: TestResults): void {
    Logger.section('WORKFLOW TEST SUMMARY');
    Logger.success(`Conversation ID: ${results.conversationId}`);
    Logger.success(`Actions detected: ${results.actionsDetected}`);
    Logger.success(`Final transcript length: ${results.finalTranscriptLength} characters`);
    
    if (results.success) {
      Logger.log('🎉 Workflow test completed successfully!');
    } else {
      Logger.error('Test failed:', results.error);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Getters for accessing internal state
  getConversationId(): string {
    return this.conversationId;
  }

  getDetectedActions(): Action[] {
    return this.wsClient.getDetectedActions();
  }

  getFinalTranscript(): string {
    return this.wsClient.getFinalTranscript();
  }

  // Reset method for running multiple tests
  reset(): void {
    this.conversationId = uuidv4();
    this.wsClient.reset();
  }
}
