class MainController < ApplicationController
  
  def start
    @schwerpunkte = Focus.all
    @version = current_selection.version
    @mein_schwerpunkt = current_selection.focus
    respond_to do |format|
      format.html { render :action => "start" }
    end
  end
  
  def index
    date = "#{Date.today.strftime("%Y-%m-")}#{Date.today.mday-2}"
    puts date
    old_sessions = ModuleSelection.find(:all, :conditions => "updated_at < '#{date}'")
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
    selection = current_selection
    selection.focus == nil ? @schwerpunkt = "Kein Schwerpunkt gewählt" : @schwerpunkt = selection.focus.name
    @version = selection.version
    @modules = selection.selection_modules
    @grade = get_note["gesamt"]
    @semesters = selection.semesters

    @categories = sort_by_category @modules

    respond_to do |format|
      format.pdf
      format.html { render :action => "get_pdf" }
      format.xml { render :xml => @categories.to_xml }
    end
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

  def combo_category
    id = params[:mod_id]
    mod = Studmodule.find(id)
    @categories = mod.categories
    respond_to do |format|
      format.html { render :action => "combo_category", :layout => false }
    end
  end

  def _check_category
    id = params[:mod_id]
    mod = Studmodule.find(id)

    # TODO Anpassen, so dass dies dynamisch erzeugt wird!!!
    @categories = Array.new
    @categories.push Category.find(:first, :conditions => "name = 'Nicht Physikalisch'")
    @categories.push Category.find(:first, :conditions => "name = 'Mathematisch-Naturwissenschaftlich'")

    respond_to do |format|
      format.html { render :action => "_check_category", :layout => false }
    end
  end

  def set_category
    id = params[:mod_id]
    cat_id = extract_category_id(params[:cat_id])

    mod = nil

    selection = current_selection

    selection.selection_modules.each do |m|
      mod = m if m.moduledata.id == id
    end

    #    category = Category.find(cat_id)

    mod.category = Category.find(cat_id) unless mod == nil ||
      mod.save
    
    render :text => "Category changed successfully..."

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
    puts id
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
    selection = current_selection
    selection.version = Version.find(params[:version])
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
    my_selection = ModuleSelection.create

    version_short = nil
    focus_name = nil

    doc.root.each_element('//version/short') do |e|
      version_short = e.text
    end

    doc.root.each_element('//focus/name') do |e|
      focus_name = e.text
    end

    if version_short == nil
      my_selection.verion = get_latest_po
    else
      my_selection.version = Version.find(:first, :conditions => "short = '#{version_short}'")
    end
    if focus_name == nil
      my_selection.focus = nil
    else
      my_selection.focus = Focus.find(:first, :conditions => "name = '#{focus_name}' AND version_id = '#{my_selection.version.id}'")
    end
    doc.root.each_element('//semester') do |s|
      my_semester = Semester.create :count => s.attributes['count']
      my_selection.semesters << my_semester
#      custom_count = 0
      s.elements.each do |m|

        my_module = SelectedModule.create :moduledata => Studmodule.find(m.attributes['moduledata']),
          :name => m.attributes['name'],
          :credits => m.attributes['credits'],
          :has_grade => m.attributes['has_grade'],
          :permission_removed => m.attributes['permission_removed'],
          :grade => m.attributes['grade']

        my_semester.modules << my_module

#        if m.attributes['id'] == "custom"
#          custom_count += 1
#          my_module = CustomModule.create
#          my_module.short = "custom#{custom_count}"
#          my_module.grade = m.attributes['grade']
#          my_module.name = m.attributes['name']
#          my_module.credits = m.attributes['credits']
#          my_semester.modules << my_module
#        else
#          my_module = Studmodule.find(:first, :conditions => "short = '#{m.attributes['short']}'")
#          my_semester.studmodules << my_module
#          s = SelectedModule.find(:first, :conditions => "module_id = '#{my_module.id}'")
#          s.grade = m.attributes['grade']
#          s.save
#        end
        
      end
    end
    my_selection.save
    session[:selection_id] = my_selection.id
  end

end
