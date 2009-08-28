class AbfragenController < ApplicationController
  
  def ueberblick
  end

  def auswahl
    sel = current_selection
    @modules = sel.modules
    respond_to do |format|
      format.xml { render :xml => @modules.to_xml }
    end
  end

  def add_to_selection
    m = Studmodule.find(params[:module_id])
    current_selection.modules << m
    s.save
    redirect_to :action => "auswahl"
  end

  def remove_from_selection
    m = Studmodule.find(params[:id])
    current_selection.modules.delete m
    s.save
    redirect_to :action => "auswahl"
  end

  def pool
    @data = generate_right_list
    # @categories = Category.all # nur zu Test-Zwecken
    respond_to do |format|
      # format.html
      format.xml { render :xml => @data.to_xml }
      # format.xml # rendert aus dem poo.builder
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
