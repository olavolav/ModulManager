xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.auswahl do
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

  xml.errors do
    @errors.each do |e|
      xml.error do
        xml.rule_id e.rule_id
        xml.rule_name e.rule_name
        xml.description e.description
      end
    end
  end
end