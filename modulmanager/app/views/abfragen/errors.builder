xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"
xml.errors do
  @errors.each do |element|
    xml.problem(:id => element.id)
  end
end
