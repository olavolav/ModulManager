class MainController < ApplicationController

  # Stellt für den View vorerst alle Module in unsortierter Ordnung in @modules
  # zur Verfügung
  def index
    @modules = Studmodule.all
    @categories = Category.all
  end

end
