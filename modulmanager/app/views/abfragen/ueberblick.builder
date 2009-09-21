xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"


xml.rules do
  @super_rules.each do |s|
    xml.category(:id => s.id, :credits_needed => s.credits_needed, :modules_needed => s.modules_needed, :name => s.name) do
      fullfilled = s.evaluate current_selection.modules
      xml.tag! "id", s.id
      xml.fullfilled fullfilled
      unless fullfilled == 1
        xml.text "In dieser Kategorie werden mindesten #{s.credits_needed} Credits und #{s.modules_needed} Module benötigt."
      else
        xml.text "Du hast alle Vorraussetzungen in dieser Kategorie erfüllt."
      end
      build_rules_recursive(s, xml)
    end
  end
end