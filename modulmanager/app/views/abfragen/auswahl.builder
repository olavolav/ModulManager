xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.auswahl do
  xml.focus(:id => @selection.focus.id, :name => @selection.focus.name) if @selection.focus
  xml.semesters do
    @selection.semesters.each do |s|
      xml.semester(:count => s.count) do
        s.modules.each do |m|
          xml.module(:id => m.moduledata.id) do
            xml.name m.moduledata.name
            xml.credits m.moduledata.credits
            xml.short m.moduledata.short
          end
        end
      end
    end
  end
end