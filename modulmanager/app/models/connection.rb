class Connection < ActiveRecord::Base

  has_many :child_connections,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  has_many :child_rules,
    :foreign_key => "parent_id",
    :class_name => "Rule"

  belongs_to :parent,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  belongs_to :owner,
    :class_name => "Studmodule",
    :foreign_key => "owner_id"

  def modules
    modules = Array.new
    if self.child_rules.length > 0
      self.child_rules.each do |rule|
        if rule.is_part_of_focus?
          modules = modules.concat rule.modules
        else
          unless rule.category == nil
            modules = modules.concat rule.category.modules
          end
        end
      end
    end

    if self.child_connections.length > 0
      self.child_connections.each do |connection|
        modules = modules.concat connection.modules
      end
    end
    modules.uniq!
    return modules
  end

  def relevant_modules_in_selection(auswahl)
    relevante_module = Array.new
    self.modules.each do |modul|
      relevante_module.push(modul) if auswahl.modules.include? modul
    end
    return relevante_module
  end

  def categories
    categories = Array.new
    if self.child_rules.length > 0
      self.child_rules.each do |rule|
        categories.push rule.category unless rule.category == nil
      end
    end

    if self.child_connections.length > 0
      self.child_connections.each do |connection|
        categories = categories.concat connection.categories
      end
    end
    categories.uniq!
    return categories
  end

  def removeable_grades
    counter = 0
    self.categories.each do |category|
      counter += category.grade_remove
    end
    return counter
  end

  def removed_grades selected_modules
    counter = 0
    selected_modules.each do |mod|
      if mod.has_grade == false
        self.categories.each do |category|
          if category.modules.include? mod.moduledata
            counter += 1
          end
        end
      end
    end
    return counter
  end

  def removed_too_many_grades? selected_modules
    if removed_grades(selected_modules) > removeable_grades
      return true
    else
      return false
    end
  end

  def self.create_and_connection name, description, child_rules = nil, child_connections = nil, focus = nil, version = nil, position = nil
    c = AndConnection.create :name => name, :description => description, :focus => focus, :version => version, :position => position
    if child_rules != nil
      c.child_rules = child_rules
    elsif child_connections != nil
      c.child_connections = child_connections
    end
    return c
  end

  def self.get_connection_array_from_category_string string
    connection_array = Array.new

    categories = string.split(",")
    categories.each do |c|
      c.strip!
      connection_array.push Connection.find(:first, :conditions => "name = '#{c}'")
    end

    return connection_array
  end

  def collect_child_rules selection
    array = Array.new
    self.child_connections.each do |child|
      array.push child.name if child.evaluate(selection.selection_modules) != 1
    end
    return array
  end

  def has_parent_focus?
    if self.focus == 1
      return true
    else
      return false
    end
  end

  def is_part_of_focus?
    if self.has_parent_focus?
      return true
    else
      if self.parent == nil
        return false
      else
        return self.parent.is_part_of_focus?
      end
    end
  end

  def parent_focus
    if self.has_parent_focus?
      return Focus.find(:first, :conditions => "name = #{self.name}")
    else
      if self.parent == nil
        return nil
      else
        return self.parent.parent_focus
      end
    end
  end
  
end
