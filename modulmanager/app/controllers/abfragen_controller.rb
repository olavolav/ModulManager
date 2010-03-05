class AbfragenController < ApplicationController

  def ueberblick
    selection = current_selection

    @errors = get_errors selection
    @super_rules = Connection.find(:all,
      :conditions => "parent_id IS NULL AND focus = 0 AND version_id = '#{selection.version.id}'")
    unless selection.focus == nil
      @focus_rules = Connection.find(:first,
        :conditions => "name = '#{selection.focus.name}' AND version_id = '#{selection.version.id}'")
    end

    respond_to do |format|
      format.html { render :action => "ueberblick", :layout => false }
    end
  end

  private

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
      end
    end
    return errors
  end

  public

  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml { render :action => "auswahl", :layout => false }
    end
  end

  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    respond_to do |format|
      format.xml { render :action => "pool", :layout => false }
    end
  end

  def errors
    selection = current_selection
    @errors = get_errors selection

    respond_to do |format|
      format.xml { render :action => "errors", :layout => false }
    end
  end

  def get_module_info

    mod = Studmodule.find(params[:module_id])

    selection = current_selection
    m2 = nil
    @categories = Array.new

    selection.selection_modules.each do |m|
      m2 = m if m.moduledata.short == mod.short
    end
    @id = m2.id
    if mod.short.include? "custom"
      @name = m2.name
      @description = "Dies ist ein von Ihnen konfiguriertes Modul."
      @short = "-"
      @credits = m2.credits
      @permission = nil
      @custom_credits = m2.credits
    else
      @name         = m2.moduledata.name
      @description  = m2.moduledata.description
      @short        = m2.moduledata.short
      @credits      = m2.moduledata.credits
      
      m2.credits != nil && m2.credits != "" ? @custom_credits = m2.credits : @custom_credits = -1

      if m2.moduledata.univzid != nil
        @univz_link   = "http://univz.uni-goettingen.de/qisserver/rds" +
          "?expand=0" +
          "&moduleCall=webinfo" +
          "&publishConfFile=webinfo&" +
          "publishSubDir=veranstaltung" +
          "&publishid=#{m2.moduledata.univzid}" +
          "&state=verpublish" +
          "&status=init" +
          "&vmfile=no"
      else
        @univz_link = nil
      end

      @permission = m2.moduledata.permission
      m2.moduledata.categories.each do |category|
        unless category.exclusive == 1 || category.focus != nil
          @categories.push category
        end
      end

    end
    
    m2.has_grade ? @has_grade = 1 : @has_grade = 0
    m2.permission_removed ? @has_warning = 0 : @has_warning = 1
    m2.moduledata.has_grade ? @has_general_grade = 1 : @has_general_grade = 0

    m2.category == nil ? @selected_cat = nil : @selected_cat = m2.category.id

    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end

  end

  def get_pool_module_info

    mod = Studmodule.find(params[:module_id])
    if mod.short.include? "custom"
      @name = mod.name
      @description = "Dies ist ein Modul, bei dem Sie die entsprechenden Informationen " +
        "selbst eintragen können. Ziel ist, dass Sie auch Module aus anderen Fakultäten im " +
        "ModulManager darstellen können."
      @short = "-"
      @credits = 0
      @permission = nil
      @custom_credits = nil
    else
      @name         = mod.name
      @description  = mod.description
      @short        = mod.short
      @credits      = mod.credits
      
      if mod.univzid != nil
        @univz_link   = "http://univz.uni-goettingen.de/qisserver/rds" +
          "?expand=0" +
          "&moduleCall=webinfo" +
          "&publishConfFile=webinfo&" +
          "publishSubDir=veranstaltung" +
          "&publishid=#{mod.univzid}" +
          "&state=verpublish" +
          "&status=init" +
          "&vmfile=no"
      else
        @univz_link = nil
      end
    
      # @permission = mod.permission
    end
    
    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end

  end

  def add_module_to_selection

    selection       = current_selection

    semester_count  = params[:sem_count]
    module_id       = params[:mod_id]
    category_id     = extract_category_id(params[:cat_id])

    semester = selection.semesters.find(:first, :conditions => "count = #{semester_count}")
    if semester == nil
      semester = Semester.create(:count => semester_count)
      selection.semesters << semester
    end

    studmodule      = Studmodule.find(module_id)
    selected_module = SelectedModule.create(:moduledata => studmodule)

    selected_module.category = Category.find(category_id)

    selected_module.save

    semester.modules << selected_module

    render :text => "Module added successfully..."





#    selection = current_selection
#    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
#      semester = Semester.create(:count => params[:sem_count])
#      selection.semesters << semester
#    end
#    id = params[:mod_id]
#    cat_id = extract_category_id(params[:cat_id])
#    parent_module = Studmodule.find(id)
#    my_module = SelectedModule.create(:moduledata => parent_module)
#    my_module.categories = Array.new
#    #    my_module.categories << Category.find(cat_id) unless cat_id == nil || cat_id == ""
#
#    cat_id == nil || cat_id == "" ? cat = nil : cat = Category.find(cat_id)
#    unless cat == nil
#      if cat.exclusive == 1 && parent_module.categories.length > 1
#        my_module.categories = parent_module.categories
#      else
#        my_module.categories << cat
#      end
#    end
#
#    my_module.save
#    semester.modules << my_module
#    render :text => "Module added successfully..."
  end

  def add_custom_module_to_selection

    selection = current_selection

    my_module = nil

    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end

    studmodule = Studmodule.find(params[:mod_id])

    unless my_module = CustomModule.find(:first, :conditions => "short = '#{studmodule.short}'")
      my_module = CustomModule.create(
        :moduledata => studmodule,
        :short => studmodule.short,
        :credits => params[:credits],
        :name => params[:name]
      )
    else
      my_module.credits = params[:credits]
      my_module.name = params[:name]
    end

    params[:has_grade] == nil ? my_module.has_grade = true : my_module.has_grade = params[:has_grade]

    semester.modules << my_module
    semester.save

    cat_id = params[:cat_id]
    if cat_id.class == Array
      cat_id.categories = Array.new
      cat_id.each { |c| my_module.categories << Category.find(c) }
    elsif cat_id.class == String
      my_module.categories << Category.find(cat_id)
    end

    my_module.save

    render :text => "CostumModule created and added successfully..."
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

  def remove_module_from_selection
    current_selection.selection_modules.each { |m| 
      if (m.class == CustomModule && m.id == params[:mod_id]) || (m.module_id.to_i == params[:mod_id].to_i)
        m.destroy
      end
    }
    render :text => "Module removed from selection..."
  end

  def remove_semester_from_selection
    s1 = Semester.find(
      :first,
      :conditions => "selection_id = #{current_selection.id} AND count = #{params[:sem_count]}").destroy
    modules = s1.modules
    modules.each { |m| m.destroy }
    render :text => "Semester removed from selection..."
  end

  def remove_grade
    id = params[:mod_id]
    selection = current_selection
    selection.selection_modules.each do |m|
      if m.moduledata.id == id.to_i
        m.has_grade = false
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def add_grade
    id = params[:mod_id]
    selection = current_selection
    selection.selection_modules.each do |m|
      if m.moduledata.id == id.to_i
        m.has_grade = true
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def save_module_grade

    selection = current_selection
    module_id = params[:mod_id]
    grade = params[:grade]

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.module_id.to_i == module_id.to_i
          m.grade = grade
          m.save
        end
      end
    end

    render :text => "Module grade saved successfully..."

  end

  def note

    @grade = get_note
    respond_to do |format|
      format.html { render :action => "note", :layout => false }
    end

  end

  def info
    selection = current_selection
    id = params[:id]
    @regel = Connection.find(:first, :conditions => "id = '#{id}'")
    @mods = selection.selection_modules
    #    @description = "Zu dieser Kategorie ist momentan keine Beschreibung verfügbar."
    ff = @regel.evaluate @mods, get_errors(selection)
    ff == 1 ? @fullfilled_string = "<span style='color:green'>erfüllt</span>" : @fullfilled_string = "<span style='color:red'>nicht erfüllt</span>"
    ff == 1 ? @fullfilled = true : @fullfilled = false
    @credits_earned     = @regel.collected_credits @mods, get_errors(selection)

    @available_modules  = Array.new

    if @regel.child_connections.length > 0
      @child_rules = @regel.collect_child_rules current_selection
    else
      modules = @regel.collect_unique_modules_from_children_without_custom
      modules.each do |m|
        found = false
        @mods.each { |mod| found = true if mod.moduledata.id == m.id }
        @available_modules.push m unless found
      end
    end

    respond_to do |format|
      format.html { render :action => "info", :layout => false }
    end

  end

  def change_credits
    credits = params[:credits]
    mod_id = params[:mod_id]

    selection = current_selection

    selection.selection_modules.each do |m|

      if m.moduledata.id == mod_id.to_i
        m.credits = credits
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def remove_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.selection_modules.each do |m|
      if m.moduledata.id == mod_id.to_i
        m.permission_removed = true
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end

  def add_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.selection_modules.each do |m|
      if m.moduledata.id == mod_id.to_i
        m.permission_removed = false
        m.save
        render :text => "success"
        return
      end
    end
    render :text => "error"
  end
end
