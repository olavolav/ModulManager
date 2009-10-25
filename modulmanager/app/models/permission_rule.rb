class PermissionRule < Rule

  belongs_to :condition,
    :class_name => "Studmodule",
    :foreign_key => "condition_id"

  def evaluate selected_semesters, my_semester
    puts "Werte PermissionRule #{self.id} aus..."
    selected_semesters.each do |semester|
      puts "Überprüfe Semester Nr. #{semester.count}..."
      if my_semester.to_i > semester.count
        semester.studmodules.each { |m|
          if m.short == self.condition.short
            puts "Bedingungen erfüllt!"
            return 1
          end
        }
      end
    end
    puts "Bedingungen nicht erfüllt..."
    return -1
  end

end
