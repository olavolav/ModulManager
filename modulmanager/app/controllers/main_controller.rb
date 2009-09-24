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

    headers["Content-Disposition"] = "attachment; filename=export.stpl"
    
    respond_to do |format|
      format.xml
    end

  end

  def post_file
    filename = ""

    name = params[:data_file].original_filename
    directory = "public/data"
    path = File.join(directory, name)

    File.open(path, "wb") { |f| f.write(params[:data_file].read); filename = f.path }

    shredder filename

    redirect_to :action => "index"
  end

  def import
  end

  private

  def shredder file
    xml = File.read(file)
    doc = REXML::Document.new(xml)

    my_selection = ModuleSelection.create

    doc.root.each_element('//semester') do |s|

      my_semester = Semester.create :count => s.attributes['count']

      s.elements.each do |m|

        my_module = Studmodule.find(:first, :conditions => "short = '#{m.attributes['short']}'")

        my_semester.studmodules << my_module

      end

      my_selection.semesters << my_semester

    end

    session[:selection_id] = my_selection.id

  end

end
