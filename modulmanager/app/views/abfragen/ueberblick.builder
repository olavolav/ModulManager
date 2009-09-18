xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"


xml.rules do
  @super_rules.each do |s|
    xml.connection(:id => s.id) do
      xml.evaluation s.evaluate current_selection.modules
      xml.categories build_rules_recursive(s, xml).uniq.join(", ")
    end
  end
end