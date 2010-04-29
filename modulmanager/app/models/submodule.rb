# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Submodule < Studmodule
  belongs_to :parent, :class_name => "Studmodule", :foreign_key => "parent_id"
end
