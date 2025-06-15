import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash2, Calendar, Search, FileText } from 'lucide-react';
import { Action, DetectedAction } from '../types';
import { ApiService } from '../services/api';

interface ActionsListProps {
  conversationId: string;
  apiService: ApiService;
  detectedActions: DetectedAction[];
  onError: (error: string) => void;
}

export const ActionsList: React.FC<ActionsListProps> = ({
  conversationId,
  apiService,
  detectedActions,
  onError
}) => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<{
    type?: string;
    status?: string;
    conversationId?: string;
  }>({});

  const loadActions = async () => {
    setLoading(true);
    try {
      const actionsList = await apiService.listActions({
        ...filter,
        conversation_id: conversationId,
      });
      setActions(actionsList);
    } catch (error) {
      onError(`Failed to load actions: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const updateActionStatus = async (actionId: string, status: string) => {
    try {
      await apiService.updateAction(actionId, status);
      await loadActions(); // Refresh the list
    } catch (error) {
      onError(`Failed to update action: ${error}`);
    }
  };

  useEffect(() => {
    loadActions();
  }, [filter]);

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'todo':
        return <FileText size={16} />;
      case 'calendar':
        return <Calendar size={16} />;
      case 'research':
        return <Search size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'status-created';
      case 'accepted':
        return 'status-accepted';
      case 'completed':
        return 'status-completed';
      case 'deleted':
        return 'status-deleted';
      default:
        return 'status-created';
    }
  };

  return (
    <div className="actions-list">
      <div className="actions-header">
        <h3>Actions</h3>
        <button onClick={loadActions} className="btn-secondary" disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="actions-filters">
        <select
          value={filter.type || ''}
          onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
        >
          <option value="">All Types</option>
          <option value="todo">Todo</option>
          <option value="calendar">Calendar</option>
          <option value="research">Research</option>
        </select>

        <select
          value={filter.status || ''}
          onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
        >
          <option value="">All Statuses</option>
          <option value="created">Created</option>
          <option value="accepted">Accepted</option>
          <option value="completed">Completed</option>
          <option value="deleted">Deleted</option>
        </select>

        <input
          type="text"
          placeholder="Conversation ID"
          value={filter.conversationId || ''}
          onChange={(e) => setFilter({ ...filter, conversationId: e.target.value || undefined })}
        />
      </div>

      {detectedActions.length > 0 && (
        <div className="detected-actions">
          <h4>Recently Detected Actions</h4>
          {detectedActions.map((action, index) => (
            <div key={`detected-${index}`} className="action-item detected">
              <div className="action-header">
                <div className="action-type">
                  {getActionIcon(action.type)}
                  <span className="type-label">{action.type}</span>
                </div>
                <div className="action-status new">NEW</div>
              </div>
              <div className="action-content">
                <h5>{action.inner.title}</h5>
                {action.inner.body && <p>{action.inner.body}</p>}
                {action.inner.query && <p><strong>Query:</strong> {action.inner.query}</p>}
                {action.inner.datetime && <p><strong>Date:</strong> {action.inner.datetime}</p>}
                <div className="action-transcript">
                  <strong>Transcript:</strong> "{action.relate.transcript}"
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="saved-actions">
        <h4>Saved Actions ({actions.length})</h4>
        {actions.length === 0 ? (
          <p className="no-actions">No actions found</p>
        ) : (
          actions.map((action) => (
            <div key={action.id} className="action-item">
              <div className="action-header">
                <div className="action-type">
                  {getActionIcon(action.type)}
                  <span className="type-label">{action.type}</span>
                </div>
                <div className={`action-status ${getStatusColor(action.status)}`}>
                  {action.status}
                </div>
              </div>
              <div className="action-content">
                <h5>{action.inner.title}</h5>
                {action.inner.body && <p>{action.inner.body}</p>}
                {action.inner.query && <p><strong>Query:</strong> {action.inner.query}</p>}
                {action.inner.datetime && <p><strong>Date:</strong> {action.inner.datetime}</p>}
                <div className="action-transcript">
                  <strong>Transcript:</strong> "{action.relate.transcript}"
                </div>
                <div className="action-meta">
                  <small>Created: {new Date(action.created_at).toLocaleString()}</small>
                  <small>Updated: {new Date(action.updated_at).toLocaleString()}</small>
                </div>
              </div>
              <div className="action-controls">
                {action.status === 'created' && (
                  <button
                    onClick={() => updateActionStatus(action.id, 'accepted')}
                    className="btn-accept"
                    title="Accept Action"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                {action.status === 'accepted' && (
                  <button
                    onClick={() => updateActionStatus(action.id, 'completed')}
                    className="btn-complete"
                    title="Mark Complete"
                  >
                    <CheckCircle size={16} />
                  </button>
                )}
                <button
                  onClick={() => updateActionStatus(action.id, 'deleted')}
                  className="btn-delete"
                  title="Delete Action"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
