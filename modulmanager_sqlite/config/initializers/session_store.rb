# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_modulmanager_sqlite_session',
  :secret      => '129f21fbfcf9969e404938754586a0a2300afc53c39bbde9d27cef2bf1a5bf7b9130a7f9c520bf5ba78b6e55b75c6e942b3491f43bcf0251cc151bf3ac002261'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
