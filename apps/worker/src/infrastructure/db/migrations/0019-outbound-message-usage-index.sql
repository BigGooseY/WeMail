CREATE INDEX IF NOT EXISTS idx_mail_outbound_messages_account_status_created
  ON mail_outbound_messages (account_id, status, created_at DESC);
