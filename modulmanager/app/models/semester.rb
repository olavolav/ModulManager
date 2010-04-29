# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Semester < ActiveRecord::Base

  belongs_to :selection,
    :class_name => "ModuleSelection",
    :foreign_key => "selection_id"

  has_many :modules,
    :class_name => "SelectedModule",
    :foreign_key => "semester_id",
    :dependent => :delete_all

  has_many :studmodules,
    :class_name => "Studmodule",
    :through => :modules,
    :source => :moduledata

end
