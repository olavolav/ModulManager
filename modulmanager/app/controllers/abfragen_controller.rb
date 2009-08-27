class AbfragenController < ApplicationController
  def links
  end

  def mitte
  end

  def rechts
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
      i = 0
      parent.categories.each do |c|
        i += 1
        hash[c.name] = Hash.new
        hash[c.name] = rekursiv(c, hash[c.name])
      end
    else
      return parent.studmodules
    end
    return hash
  end

end
