# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class PermissionRule < Rule

  belongs_to :condition,
    :class_name => "Studmodule",
    :foreign_key => "condition_id"

  def evaluate selected_semesters, my_semester
    selected_semesters.each do |semester|
      # Abfrage für den Fall, dass die Vorbedingung auch im selben Semester
      # stattfinden kann
      #      if my_semester.to_i >= semester.count && semester.count > 0
      # Abfrage für den Fall, dass die Vorbedingung mindestens im vorhergehenden
      # Semester oder früher erfüllt sein muss
      if my_semester.to_i > semester.count && semester.count > 0
        semester.studmodules.each do |m|
          #          if m.short == self.condition.short
          puts "Checking conditions..."
          puts "Condition_id: #{self.condition_id}"
          puts "Module_id: #{m.id}"
          if m.id == self.condition_id
            puts "---Conditions met!---"
            return 1
          end
        end
      end
    end
    puts "---Conditions not met!---"
    return -1
  end

end
