class AbfragenController < ApplicationController
  
  def ueberblick
  end

  def auswahl
  end

  def pool
    @data = generate_right_list
    respond_to do |format|
      # format.html
      format.xml { render :xml => @data.to_xml }
    end
  end

  private

  def generate_right_list
    root = Category.find(:first, :conditions => "category_id IS null")
    return rekursiv(root, Hash.new)
  end

  def rekursiv(parent, hash)
    if(parent.categories != [])
      parent.categories.each do |c|
        hash[c.name] = Hash.new
        hash[c.name] = rekursiv(c, hash[c.name])
      end
    else
      return parent.modules
    end
    return hash
  end

end
