xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.root do

  xml.category(:name => "Bachelor", :class => "Allgemein", :id => "null") do
    build_xml_bachelor_recursive(@root, xml)
  end

  @schwerpunkte.each do |s|
    xml.category(:name => s.name, :class => "Schwerpunkt", :id => "category#{s.id}") do
      s.modules.each do |m|
        xml.module(:id => m.id) do
          xml.tag! "id", m.id
          xml.name m.name
          xml.short m.short
          xml.credits m.credits
        end
      end
    end
  end
  
end


