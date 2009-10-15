class PermissionRule < Rule

  belongs_to :condition,
    :class_name => "Studmodule",
    :foreign_key => "condition_id"

  def evaluate selected_semesters, my_semester
    selected_semesters.each do |semester|
      if my_semester.to_i > semester.count
        semester.studmodules.each { |m|
          return 1 if m.short == self.condition.short
        }
      end
    end
    return -1
  end

end
