set :application, "modulmanager"
set :repository,  "https://adiungiforge.springloops.com/source/adiungistudienplaner"

set :scm, :subversion
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

role :web, "rortest.adiungi.net"                          # Your HTTP server, Apache/etc
role :app, "rortest.adiungi.net"                          # This may be the same as your `Web` server
role :db,  "mysql5.sorgesolutions.de", :primary => true # This is where Rails migrations will run
#role :db,  "your slave db-server here"

set :deploy_to, "/"

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end