# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class OrConnection < Connection

  def credits_earned
    return 0
  end


  # options kann zwei mögliche Inhalte haben:
  # - Zähler des Semesters, aus der die Überprüfung kommt, bei PermissionRules
  # - Array mit Modulen, deren Voraussetzungen nicht erfüllt sind
  def evaluate selected_modules, options = nil
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| return 1 if d.evaluate(selected_modules, options) == 1 }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| return 1 if d.evaluate(selected_modules, options) == 1 }
    end
    return -1
  end

  def credits_needed
    credits = 9999
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| credits = d.credits_needed if d.credits_needed < credits }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| credits = d.count if d.count < credits }
    end
    return credits
  end

  def modules_needed
    modules = 9999
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| modules = d.modules_needed if d.modules_needed < modules }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| modules = d.count if d.count < modules }
    end
    return modules
  end

end
