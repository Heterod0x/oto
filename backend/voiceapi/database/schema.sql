-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    audio_url TEXT,
    transcript TEXT,
    last_transcript_preview TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actions table
CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('todo', 'calendar', 'research')),
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'accepted', 'deleted', 'completed')),
    title TEXT NOT NULL,
    body TEXT,
    query TEXT, -- for research actions
    datetime TIMESTAMP WITH TIME ZONE, -- for calendar actions
    transcript_start INTEGER, -- milliseconds
    transcript_end INTEGER, -- milliseconds
    transcript_excerpt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create conversation_logs table for summary logs
CREATE TABLE conversation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    start_time INTEGER NOT NULL, -- milliseconds
    end_time INTEGER NOT NULL, -- milliseconds
    speaker VARCHAR(20) NOT NULL CHECK (speaker IN ('user', 'assistant')),
    summary TEXT NOT NULL,
    transcript_excerpt TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_status ON conversations(status);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at);

CREATE INDEX idx_actions_conversation_id ON actions(conversation_id);
CREATE INDEX idx_actions_user_id ON actions(user_id);
CREATE INDEX idx_actions_type ON actions(type);
CREATE INDEX idx_actions_status ON actions(status);
CREATE INDEX idx_actions_created_at ON actions(created_at);

CREATE INDEX idx_conversation_logs_conversation_id ON conversation_logs(conversation_id);
CREATE INDEX idx_conversation_logs_start_time ON conversation_logs(start_time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_actions_updated_at 
    BEFORE UPDATE ON actions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_logs ENABLE ROW LEVEL SECURITY;

-- Policies for conversations
CREATE POLICY "Users can view their own conversations" ON conversations
    FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can insert their own conversations" ON conversations
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can update their own conversations" ON conversations
    FOR UPDATE USING (user_id = current_setting('app.current_user_id'));

-- Policies for actions
CREATE POLICY "Users can view their own actions" ON actions
    FOR SELECT USING (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can insert their own actions" ON actions
    FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can update their own actions" ON actions
    FOR UPDATE USING (user_id = current_setting('app.current_user_id'));

-- Policies for conversation_logs
CREATE POLICY "Users can view their own conversation logs" ON conversation_logs
    FOR SELECT USING (
        conversation_id IN (
            SELECT id FROM conversations WHERE user_id = current_setting('app.current_user_id')
        )
    );

CREATE POLICY "Users can insert their own conversation logs" ON conversation_logs
    FOR INSERT WITH CHECK (
        conversation_id IN (
            SELECT id FROM conversations WHERE user_id = current_setting('app.current_user_id')
        )
    );
