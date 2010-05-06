# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

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

  def parent_selection
    return self.semester.selection
  end

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

        if teilmodul != nil
          teilmodul_note = teilmodul.calculation_grade(auswahl).to_f
          if teilmodul_note != 0
            kumulierte_note     += teilmodul.credits.to_f * teilmodul_note
            kumulierte_credits  += teilmodul.credits.to_f
          end
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
      return self[:credits].to_i
    else
      if self[:credits] != nil
        return self[:credits].to_i
      else
        return self.moduledata.credits.to_i
      end
    end
  end

  def has_custom_credits?
    if self[:credits] == nil
      return false
    else
      return true
    end
  end

  def grade
    if self[:grade] == nil
      return 0
    else
      return self[:grade].to_f
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

  def name
    if self[:name] == nil
      return self.moduledata.name
    else
      return self[:name]
    end
  end

  def subname
    unless self.moduledata.subname == nil
      return self.moduledata.subname
    else
      return ""
    end
  end

  def short
    return self.moduledata.short
  end

  def written_grade
    if self.has_grade == false
      return "Note gestrichen"
    end
    if self.moduledata.has_grade == false
      return "unbenotetes Modul"
    end
    if self.grade == 0
      return "keine Note angegeben"
    end
    return "Note " + self.grade.to_s
  end

  def to_string_for_printing show_grade = true
    text = self.name.to_s +
      self.subname.to_s +
      " (" + self.short.to_s + "), " +
      self.credits.to_s + " Credits"
    unless show_grade == false
      text += ", " + self.written_grade.to_s
    end
    return text
  end

  def get_persistence_hash
    result = Hash.new
    result[:module_id]          = self[:module_id]
    result[:grade]              = self[:grade]
    result[:name]               = self[:name]
    result[:credits]            = self[:credits]
    result[:short]              = self[:short]
    #    result[:parent_id]          = self[:parent_id]
    result[:category_id]        = self[:category_id]
    result[:permission_removed] = self[:permission_removed]
    result[:has_grade]          = self[:has_grade]
    cat_ids = Array.new
    self.categories.each { |c| cat_ids.push c.id }
    result[:categories]         = cat_ids.join(",")
    result[:type] = "Custom" if self.class == CustomModule
    return result
  end

  def fill_with_import_data data
    data.each do |key, val|
      if val == ""
        data[key] = nil
      end
    end
    if SelectedModule.validate_data_import(data)
      self[:module_id]            = data['module_id']
      self.grade                  = data['grade']
      self[:name]                 = data['name']
      self[:credits]              = data['credits']
      self[:short]                = data['short']
      #    self[:parent_id]            = data['parent_id']
      self[:category_id]          = data['category_id']
      self[:permission_removed]   = data['permission_removed']
      self[:has_grade]            = data['has_grade']
      unless data['categories'] == "" || data['categories'] == nil
        cat_ids = data['categories'].split(",")
        cat_ids.each { |id| self.categories << Category.find(id.to_i) }
      end
      self[:type] = "CustomModule" if data['type'] == "Custom"
      self.save
      return true
    else
      return false
    end
  end

  def grade=(grade)
    if SelectedModule.check_grade(grade.to_f)
      self[:grade] = grade
    end
  end

  def set_credits_to credits
    old_credits = self.credits
    self.credits = credits
    unless self.credits == old_credits
      return true
    end
    return false
  end

  def credits=(credits)
    if SelectedModule.check_credits(credits)
      self[:credits] = credits
    end
  end

  def name=(name)
    if SelectedModule.check_name(name)
      self[:name] = name
    end
  end

  def short=(short)
    if SelectedModule.check_short(short)
      self[:short] = short
    end
  end

  def self.validate_data_import data
    unless SelectedModule.check_grade(data['grade'].to_f)
      puts "Falsche Note beim Import"
      return false
    end
    unless SelectedModule.check_category_id(data['category_id'].to_i)
      puts "Falsche Category_ID beim Import"
      return false
    end
    unless SelectedModule.check_credits(data['credits'].to_i)
      puts "Falsche Credits beim Import"
      return false
    end
    unless SelectedModule.check_module_id(data['module_id'].to_i)
      puts "Falsche Module_ID beim Import"
      return false
    end
    unless SelectedModule.check_name(data['name'])
      puts "Falscher Name beim Import"
      return false
    end
    unless SelectedModule.check_permission_removed(data['permission_removed'])
      puts "Falscher Parameter 'permission_removed' beim Import"
      return false
    end
    unless SelectedModule.check_short(data['short'])
      puts "Falsches Short beim Import"
      return false
    end
    return true
  end

  def self.check_grade grade
    grade = nil if grade == 0.0
    allowed_classes = [Fixnum, Float, NilClass]
    if allowed_classes.include? grade.class
      if grade.to_f >= 1.0 && grade.to_f <= 5.0
        return true
      elsif grade == nil
        return true
      else
        return false
      end
    else
      return false
    end
  end

  def self.check_credits credits
    if ((credits.to_f*10)%10) == 0
      return true
    else
      return false
    end
  end

  def self.check_module_id module_id
    if module_id.class == Fixnum
      if Studmodule.find(module_id) == nil
        return false
      else
        return true
      end
    else
      return false
    end
  end

  def self.check_name name
    if name != nil
      forbidden_array = ["\\", "{", "}", "[", "]", "^"]
      name.split("").each do |char|
        if forbidden_array.include? char.to_s
          return false
        end
      end
    end
    return true
  end

  def self.check_short short
    if short != nil
      forbidden_array = ["\\", "{", "}", "[", "]", "^"]
      forbidden_array.each do |char|
        if name.include? char
          return false
        end
      end
    end
    return true
  end

  def self.check_category_id category_id
    if category_id != nil && category_id != 0
      if category_id.class == Fixnum
        if Category.find(category_id) == nil
          return false
        end
      else
        return false
      end
    end
    return true
  end

  def self.check_permission_removed removed_parameter
    if removed_parameter != nil
      allowed_classes = ["true", "false"]
      unless allowed_classes.include? removed_parameter
        return false
      end
    end
    return true
  end

  def is_permitted?
    semester = self.parent_selection.semesters
    semester.delete_if { |s| s.count <= 0 }
    count = self.semester.count
    if self.moduledata.permission == nil || self.permission_removed
      return true
    else
      return self.moduledata.permission.evaluate(semester, count) == 1
    end
  end

  def has_changed_credits?
    unless self[:credits] == nil
      return true
    end
    return false
  end

  def has_removed_permission?
    if self[:permission_removed] == true
      return true
    end
    return false
  end

  def has_removed_grade?
    if self.is_custom_module?
      return false
    else
      return !self.has_grade
    end
  end

  def category
    if self.parent == nil
      return Category.find(self[:category_id])
    else
      selection = self.parent_selection
      parent = selection.selection_modules.find(:first, :conditions => "module_id = #{self.parent.id}")
      return parent.category
#      return self.parent_selection.selection_modules.find(:first, :conditions => "module_id = #{self.moduledata.parent.id}").category
    end
  end

  def parent
    return self.moduledata.parent
  end

end
