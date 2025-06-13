import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { ApiConfig } from '../types';
import { getDefaultApiConfig } from '../config/env';

interface ConfigPanelProps {
  config: ApiConfig;
  onConfigChange: (config: ApiConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState(config);

  const handleSave = () => {
    onConfigChange(localConfig);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalConfig(getDefaultApiConfig());
  };

  return (
    <div className="config-panel">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="config-toggle"
        title="API Configuration"
      >
        <Settings size={20} />
        Configuration
      </button>

      {isOpen && (
        <div className="config-modal">
          <div className="config-content">
            <h3>API Configuration</h3>
            
            <div className="form-group">
              <label htmlFor="baseUrl">Base URL:</label>
              <input
                id="baseUrl"
                type="text"
                value={localConfig.baseUrl}
                onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
                placeholder="http://localhost:3000"
              />
            </div>

            <div className="form-group">
              <label htmlFor="userId">User ID:</label>
              <input
                id="userId"
                type="text"
                value={localConfig.userId}
                onChange={(e) => setLocalConfig({ ...localConfig, userId: e.target.value })}
                placeholder="test-user-123"
              />
            </div>

            <div className="form-group">
              <label htmlFor="authToken">Auth Token:</label>
              <input
                id="authToken"
                type="text"
                value={localConfig.authToken}
                onChange={(e) => setLocalConfig({ ...localConfig, authToken: e.target.value })}
                placeholder="Bearer test-token"
              />
            </div>

            <div className="config-actions">
              <button onClick={handleReset} className="btn-secondary">
                Reset to Defaults
              </button>
              <button onClick={() => setIsOpen(false)} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
