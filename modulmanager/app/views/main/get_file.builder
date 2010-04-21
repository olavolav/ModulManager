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

  selection.semesters.each do |semester|
    xml.semester(:count => semester.count) do
      semester.modules.each do |modul|
        xml.module(modul.get_persistence_hash)
      end
    end
  end




#  selection.semesters.each do |s|
#    xml.semester(:count => s.count) do
#      s.modules.each do |m|
#        xml.module(
#          :moduledata => m.module_id,
#          :name => m.name,
#          :credits => m.credits,
#          :has_grade => m.has_grade,
#          :permission_removed => m.permission_removed,
#          :grade => m.grade
#        )
#      end
#    end
#  end

end