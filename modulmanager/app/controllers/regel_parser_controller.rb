# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class RegelParserController < ApplicationController

  USER_ID, PASSWORD = "mm_admin_123", "georgia augusta"

  before_filter :authenticate

  def start
    
    if RegelParser.any_rules_currently_in_database?
      redirect_to :action => "clear"
      
    else
      version = nil
      
      po_entries = Dir.entries("config/basedata/")
      
      po_entries.delete(".")
      po_entries.delete("..")
      po_entries.delete(".svn")
      po_entries.delete("README.txt")
      
      
      po_entries.each do |entry|
        RegelParser.check_syntax "config/basedata/#{entry}"
        version = RegelParser.initialize_po "config/basedata/#{entry}"
      end
      
      @modules = Studmodule.all
      @groups = Category.all
      @foci = Focus.all
      @rules = Rule.all
      @connections = Connection.all
      respond_to do |format|
        format.html
      end
    end
  end

  def clear
    @connections, @rules, @groups, @foci, @modules, @sessions, @versions = RegelParser.clear
  end


  def authenticate
    authenticate_or_request_with_http_basic do |id, password|
      id == USER_ID && password == PASSWORD
    end
  end

end
