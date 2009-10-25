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

end
