xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

c = Category.find(:first, :conditions => "category_id IS NULL")

xml.rules do
  build_xml_rules_recursive c, xml
end