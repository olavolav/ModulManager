# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Version < ActiveRecord::Base

  has_many :foci, :class_name => "Focus", :foreign_key => "version_id"

end
