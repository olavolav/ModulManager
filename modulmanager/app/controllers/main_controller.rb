class MainController < ApplicationController

  # Stellt f�r den View vorerst alle Module in unsortierter Ordnung in @modules
  # zur Verf�gung
  def index
    @modules = Studmodule.all
    @categories = Category.all
  end

end
