xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.bachelor do

  rekursiv(@root, xml)

end
