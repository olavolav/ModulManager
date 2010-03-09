xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

categories = Array.new
@m.categories.each {|c| categories.push c.name}

xml.module do
  xml.tag! "id", @m.id
  xml.name @m.name
  xml.categories categories.join(", ")
  xml.has_general_grade @m.has_grade
  xml.credits @m.credits
  xml.short @m.short
  xml.grade @m.grade
  xml.class "custom"
end