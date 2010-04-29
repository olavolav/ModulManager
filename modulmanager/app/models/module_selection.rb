# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class ModuleSelection < ActiveRecord::Base

  has_many :semesters,
    :class_name => "Semester",
    :foreign_key => "selection_id",
    :dependent => :delete_all
  
  belongs_to :focus,
    :class_name => "Focus",
    :foreign_key => "focus_id"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  has_many :selection_modules,
    :through => :semesters,
    :class_name => "SelectedModule",
    :source => :modules

  def modules
    modules = Array.new
    self.semesters.each do |s|
      if s.count > 0
        s.studmodules.each do |sm|
          modules.push sm
        end
      end
    end
    modules
  end

#  def selection_modules
#    mods = Array.new
#    self.semesters.each do |s|
#      if s.count > 0
#        s.modules.each do |sm|
#          mods.push sm
#        end
#      end
#    end
#    mods
#  end

end
