# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class MainController < ApplicationController
  
  $MMversion = "1 (beta)"
  $DebugMode = false
  $JavaScriptFilesCompiled = false
  
  def start
    if session[:selection_id] == nil
      @new_session = true
    else
      @new_session = false
    end
    selection = current_selection
    @schwerpunkte = Focus.find(:all, :conditions => "version_id = #{selection.version.id}")
    @version = selection.version
    @mein_schwerpunkt = selection.focus
    respond_to do |format|
      format.html { render :action => "start" }
    end
  end
  
  def index
    old_sessions = ModuleSelection.find(:all, :conditions => "updated_at < '#{Date.today - 2}'")
    old_sessions.each { |session| session.destroy }

    selection = current_selection
    selection.focus == nil ? @schwerpunkt = "Kein Schwerpunkt gewählt" : @schwerpunkt = selection.focus.name
    @version = selection.version
    @categories = Array.new
    all_categories = Category.all
    all_categories.each { |c| @categories.push c if c.sub_categories.length == 0 && c.visible }
    respond_to do |format|
      format.html { render :layout => "modulmanager" }
    end
  end

  def help
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end

  def impressum
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end

  def export
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end
  
  def import
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end

  def import2
    @version = current_selection.version
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end

  def import3
    @version = current_selection.version
    respond_to do |format|
      format.html { render :layout => "rest" }
    end
  end

  def save_version

    new_version = Version.find(params[:version])
    selection = current_selection
    selection.version = new_version
    selection.save
    version_modules = Studmodule.find(:all, :conditions => "version_id = '#{selection.version.id}'")

    @deprecated_modules = Array.new

    selection.selection_modules.each do |sm|
      found = false
      version_modules.each do |vm|
        found = true if (sm.moduledata.short == vm.short) && (sm.moduledata.credits == vm.credits)
      end
      unless found
        @deprecated_modules.push({:name => sm.moduledata.name, :short => sm.moduledata.short, :credits => sm.moduledata.credits, :grade => sm.grade})
        sm.destroy
      end
    end
    
    respond_to do |format|
      format.html
    end
  end
  
  def get_file

    headers["Content-Disposition"] = "attachment; filename=studienplan.stpl"

    respond_to do |format|
      format.xml
    end

  end

  def get_token

    render :text => form_authenticity_token, :layout => false

  end
  
  def get_pdf
    @selection = current_selection
    @selection.focus == nil ? @schwerpunkt = "Kein Schwerpunkt gewählt" : @schwerpunkt = @selection.focus.name
    @version = @selection.version
    @modules = @selection.selection_modules
    @grade = get_note
    @semesters = @selection.semesters.find(:all, :order => "count ASC")
    @errors = get_errors @selection

    @show_grades = (params[:grades] == "true")
    puts @show_grades

    @categories = get_used_connections @modules

    respond_to do |format|
      if @show_grades
        format.pdf { render :filename => "ModulManager.pdf"}
      else
        format.pdf { render :filename => "ModulManager ohne Noten.pdf" }
      end
      format.html { render :action => "get_pdf" }
      format.xml { render :xml => @categories.to_xml }
    end
  end
  
  def get_errors selection
    errors = Array.new
    selection.semesters.each do |semester|
      if semester.count > 0
        count = semester.count
        semester.modules.each do |mod|
          if mod.moduledata.permission == nil || mod.permission_removed
            permission = 1
          else
            permission = mod.moduledata.permission.evaluate(selection.semesters, count)
          end
          errors.push mod.moduledata unless permission == 1
        end
      else
        semester.modules.each do |mod|
          errors.push mod.moduledata
        end
      end
    end
    return errors
  end

  def sort_by_category selected_modules
    result = Hash.new

    selected_modules.each do |mod|
      # Direkt zugeordnete Kategorien
      mod.categories.each do |category|
        result[category.name] = Array.new if result[category.name] == nil
        result[category.name].push mod
        #        result[category.name].push mod.moduledata.name
      end
      # Indirekt über Studmodule zugeordnete Kategorien
      mod.moduledata.categories.each do |category|
        result[category.name] = Array.new if result[category.name] == nil
        result[category.name].push mod
        #        result[category.name].push mod.moduledata.name
      end
    end

    return result
  end

  def get_used_categories selected_modules
    kategorien = Array.new
    selected_modules.each do |modul|
      modul.categories.each {|kategorie| kategorien.push kategorie}
      modul.moduledata.categories.each {|kategorie| kategorien.push kategorie}
    end
    return kategorien.uniq
  end

  def get_used_connections selected_modules
    kategorien = get_used_categories selected_modules
    verbindungen = Array.new
    kategorien.each do |kategorie|
      kategorie.connections.each do |verbindung|
        verbindungen.push verbindung
      end
    end
    return verbindungen.uniq
  end

  def combo_category
    @id = params[:mod_id]
    @mod = Studmodule.find(@id)

    @selected_cat = current_selection.selection_modules.find(:first, :conditions => "module_id = #{@mod.id}").category
    #    @selected_cat = SelectedModule.find(:first, :conditions => "module_id = #{mod.id}").category

    @categories = Array.new
    @mod.categories.each do |category|
      unless category.focus != nil
        @categories.push category
      end

#      unless category.exclusive == 1 || category.focus != nil
#        @categories.push category
#      end
    end
    found = false
    @categories.each {|cat| found = true if cat.exclusive != 1}
    unless found
      @categories = Array.new
    end
    respond_to do |format|
      format.html { render :action => "combo_category", :layout => false }
    end
  end

  def _check_category
    @categories = Array.new
    Category.find(:all, :conditions => "exclusive = 1 AND version_id = #{current_selection.version.id}").each do |category|
      @categories.push category
    end

    respond_to do |format|
      format.html { render :action => "_check_category", :layout => false }
    end
  end

  def set_category
    id = params[:mod_id]
    cat_id = params[:cat_id]
    selection = current_selection

    mod = selection.selection_modules.find(:first, :conditions => "module_id = #{id}")

    unless mod == nil
      new_cat = Category.find(cat_id)
      mod.category = new_cat
#      if mod.children != nil && mod.children.length > 0
#        mod.children.each do |child|
#          mod_to_change = current_selection.selection_modules.find(:first, :conditions => "module_id = #{child.id}")
#          mod_to_change.category = new_cat
#          mod_to_change.save
#        end
#      end
      mod.save
    end

    render :text => "success"

  end

  def extract_category_id id_string
    id = ""
    found = false
    id_string.each_char do |c|
      if found
        id = "#{id}#{c}"
      else
        found = true if c == "_"
      end
    end
    return id
  end

  def post_file
    filename = ""

    unless params[:data_file] == ""
      name = params[:data_file].original_filename
      directory = "public/data"
      path = File.join(directory, name)

      File.open(path, "wb") { |f| f.write(params[:data_file].read); filename = f.path }

      shredder filename

      redirect_to :action => "import2"
    else
      flash[:notice] = "<p style='color: red;'>Bitte eine Datei zum Importieren auswählen!</p>"
      redirect_to :action => "import"
    end
  end

  def focus_selection
    focus = Focus.find(:first, :conditions => "id = '#{params[:id]}'")
    selection = current_selection
    selection.focus = focus
    selection.save
    render :text => "Supi!"
  end

  def version_selection
    selection           = current_selection
    selection.version   = Version.find(params[:version])
    selection.focus     = nil
    selection.save
    render :text => selection.version.name
  end

  def create_selection
    selection = current_selection
    found = false
    Focus.all.each do |f|
      if selection.focus == f
        found = true
        selection.semesters = create_pre_selection f.name
        selection.save
      end
    end
    selection.semesters = create_pre_selection "standard" unless found
    redirect_to :action => "index"
  end

  private

  def shredder file
    xml = File.read(file)
    doc = REXML::Document.new(xml)

    selection = current_selection
    selection.destroy
    selection = ModuleSelection.new

    version_short = nil
    focus_name = nil

    doc.root.each_element('//version/short') do |e|
      version_short = e.text
    end

    doc.root.each_element('//focus/name') do |e|
      focus_name = e.text
    end

    using_version = Version.find(:first, :conditions => "short = '#{version_short}'")
    if using_version == nil
      selection.version = get_latest_po
    else
      selection.version = using_version
    end

    using_focus = Focus.find(:first, :conditions => "name = '#{focus_name}' AND version_id = '#{selection.version.id}'")
    selection.focus = using_focus

    doc.root.each_element('//semester') do |s|
      semester = Semester.new
      semester.count = s.attributes['count']
      s.elements.each do |m|
        modul = SelectedModule.new
        if modul.fill_with_import_data(m.attributes)
          modul.save
          semester.modules << modul
        else
          puts "Fehler beim Import von Modul #{m.attributes['module_id']}"
        end
      end
      semester.save
      selection.semesters << semester
    end

    selection.save
    session[:selection_id] = selection.id
  end

end
