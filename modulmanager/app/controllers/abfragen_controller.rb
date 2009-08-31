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
    s = current_selection
    s.modules << m
    s.save
    redirect_to :action => "auswahl"
  end

  def remove_from_selection
    m = Studmodule.find(params[:id])
    s = current_selection
    s.modules.delete m
    s.save
    redirect_to :action => "auswahl"
  end

  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    respond_to do |format|
      format.xml
    end
  end

  private

  def current_selection
    session[:selection_id] ||= ModuleSelection.create.id
    ModuleSelection.find session[:selection_id]
  end

end
