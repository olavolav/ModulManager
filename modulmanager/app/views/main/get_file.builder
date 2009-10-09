selection = current_selection

xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.session do

  xml.version do
    xml.tag! "id", selection.version.id
    xml.short selection.version.short
  end

  unless selection.focus == nil
    xml.focus do
        xml.tag! "id",  selection.focus.id
        xml.name        selection.focus.name
    end
  end

  selection.semesters.each do |s|
    xml.semester(:id => s.id, :count => s.count) do
      s.studmodules.each do |m|
        xml.module(:id => m.id, :name => m.name, :short => m.short)
      end
    end
  end

end