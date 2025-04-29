from supabase import create_client

from app.config import supabase_config

supabase_client = create_client(
    supabase_config.supabase_url,
    supabase_config.supabase_key,
)
