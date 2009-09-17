xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"


xml.rules do
  @super_rules.each do |s|

    xml.rule(:id => s.id) do
      xml.evaluation s.evaluate @modules
      xml.connection s.class
      xml.rules do
        s.child_rules.each do |cr|
          xml.rule(:id => cr.id) do
            xml.evaluation cr.evaluate @modules
            xml.count cr.count
            xml.relation cr.relation
            xml.category cr.category.name
          end
        end
      end
    end

  end
end