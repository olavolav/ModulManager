# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class PermissionRule < Rule

  belongs_to :condition,
    :class_name => "Studmodule",
    :foreign_key => "condition_id"

  def evaluate selected_semesters, my_semester
    selected_semesters.each do |semester|
      if my_semester.to_i >= semester.count && semester.count > 0
        semester.studmodules.each { |m|
          if m.short == self.condition.short
            return 1
          end
        }
      end
    end
    return -1
  end

end
