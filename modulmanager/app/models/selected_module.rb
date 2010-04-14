class SelectedModule < ActiveRecord::Base

  belongs_to :semester,
    :class_name => "Semester",
    :foreign_key => "semester_id"

  belongs_to :moduledata,
    :class_name => "Studmodule",
    :foreign_key => "module_id"

  has_and_belongs_to_many :categories,
    :class_name => "Category",
    :join_table => "categories_selected_modules"

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def is_head_module?
    if self.moduledata.children != nil && self.moduledata.children != []
      return true
    else
      return false
    end
  end

  def is_child_module?
    if self.moduledata.parent != nil
      return true
    else
      return false
    end
  end

  def is_custom_module?
    if self.class == CustomModule
      return true
    else
      return false
    end
  end

  def is_allowed? auswahl, semester_count
    if (
        self.permission_removed ||
          self.moduledata.permission == nil ||
          self.moduledata.permission.evaluate(auswahl.semesters, semester_count) == 1
      )
      return true
    else
      return false
    end
  end

  def module_type
    if self.is_head_module?
      return SelectedModule::module_type_head
    elsif self.is_child_module?
      return SelectedModule::module_type_child
    elsif self.is_custom_module?
      return SelectedModule::module_type_custom
    else
      return SelectedModule::module_type_normal
    end
  end

  def self.module_type_head
    return "head"
  end

  def self.module_type_child
    return "child"
  end

  def self.module_type_custom
    return "custom"
  end

  def self.module_type_normal
    return "normal"
  end

  # Note zur Berechnung der Gesamtnote
  def calculation_grade(auswahl)
    if self.module_type == SelectedModule::module_type_head
      kumulierte_note     = 0
      kumulierte_credits  = 0

      if self.grade != 0
        kumulierte_note     += self.credits * self.grade
        kumulierte_credits  += self.credits
      end

      self.moduledata.children.each do |teilmodul_data|

        teilmodul = auswahl.selection_modules.find(:first, :conditions => "module_id = #{teilmodul_data.id}")

        teilmodul_note = teilmodul.calculation_grade(auswahl).to_f
        if teilmodul_note != 0
          kumulierte_note     += teilmodul.credits.to_f * teilmodul_note
          kumulierte_credits  += teilmodul.credits.to_f
        end
      end
      if kumulierte_note > 0
        note = kumulierte_note / kumulierte_credits
      else
        note = 0
      end
      return note
    else
      if self.has_grade
        if self.grade != nil
          return self.grade
        else
          return 0
        end
      else
        return 0
      end
    end
  end

  def credits
    case self.module_type
    when SelectedModule::module_type_custom
      return self[:credits]
    else
      if self[:credits] != nil
        return self[:credits]
      else
        return self.moduledata.credits
      end
    end
  end

  def grade
    if self[:grade] == nil
      return 0
    else
      return self[:grade]
    end
  end

  # Credits zur Berechnung der Gesamtnote
  def calculation_credits(auswahl)
    credits = 0
    case self.module_type
    when SelectedModule::module_type_head
      credits = self.credits
      self.moduledata.children.each do |child_data|
        child = auswahl.selection_modules.find(:first, :conditions => "module_id = #{child_data.id}")
        credits += child.credits
      end
    when SelectedModule::module_type_child
      credits = 0
    else
      credits = self.credits
    end
    return credits
  end

end
