# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def current_selection
    session[:selection_id] ||= new_selection
    ModuleSelection.find session[:selection_id]
  end

end
