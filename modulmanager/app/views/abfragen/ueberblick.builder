xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.errors do
  @errors.each do |e|
    xml.error(:rule_id => e.rule_id) do
      xml.rule_name e.rule_name
      xml.description e.description
    end
  end
end