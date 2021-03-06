# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

module MainHelper

  def permission_tree permission
    string = ""
    if permission.child_connections.length > 0
      permission.child_connections.each { |c| string += permission_tree c }
    elsif permission.child_rules.length > 0
      permission.child_rules.each { |r|
        string = "#{string}<li>#{r.condition.name}</li>" unless r.condition == nil
        string = "#{string}<li>Leere Condition</li>" if r.condition == nil
      }
    end
    return "#{string}"
  end

  def build_tex_rules_recursive r, non_permitted_modules, selection

    element = "\\subsubsection*{#{r.name}}"
    if r.evaluate(selection.selection_modules, non_permitted_modules) != 1
      element += r.get_status_description_string_for_printing(selection.selection_modules, non_permitted_modules, true).to_s
    end
    
    if r.child_connections != []
      list = ""
      r.child_connections.each do |c|
        list += build_tex_rules_recursive c, non_permitted_modules, selection
      end
      return list
    elsif r.child_connections == []
      return "#{element}"
    end
  end

  def rtex_ao_message selected_module
    messages = Array.new
    # Note gestrichen kommt schon im Noten-Feld vor (OS)
    # if selected_module.has_removed_grade?
    #   messages.push "Note gestrichen"
    # end
    if selected_module.has_custom_credits?
      messages.push "die Credits verändert"
    end
    if selected_module.has_removed_permission?
      messages.push "eventuelle Warnungen deaktiviert"
    end
    resultString = messages.join(" und ")
    if resultString.length > 0
      resultString = "\\\\Bitte beachten: Bei diesem Modul wurden " + resultString
    end
    return resultString
  end

end
