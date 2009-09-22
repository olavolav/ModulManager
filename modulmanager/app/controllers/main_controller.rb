class MainController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :layout => "modulmanager" }
    end
  end

  def start

    # cs = current_selection

  end

  def help
  end

  def export
    

  end

  def get_file
    @selection = current_selection
    headers["Content-Type"] = "application/stpl"
    headers["Content-Disposition"] = "attachment; filename=export.stpl"
    render :xml => "Hallo Welt!"
  end

  def import
  end

  private
  
  def current_selection
    session[:selection_id] ||= new_selection
    ModuleSelection.find session[:selection_id]
  end

end
