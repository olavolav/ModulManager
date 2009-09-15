xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.auswahl(:id => @selection.id) do
  xml.focus(:id => @selection.focus.id, :name => @selection.focus.name) if @selection.focus
  xml.semesters do
    @selection.semesters.sort_by { |sem| sem.count }.each do |s| # sortiert die Semesters erst nach Stufe
      xml.semester(:count => s.count, :id => "sem#{s.id}") do
        s.modules.sort_by { |mod| mod.moduledata.short }.each do |m|
          xml.module(:id => m.moduledata.id) do
#            xml.name m.moduledata.name
#            xml.credits m.moduledata.credits
#            xml.short m.moduledata.short
          end
        end
      end
    end
  end
end