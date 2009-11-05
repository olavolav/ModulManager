class AbfragenController < ApplicationController

  def ueberblick
    selection = current_selection

    @super_rules = nil
    @focus_rules = nil
    @errors = Array.new

    @super_rules = Connection.find(:all,
      :conditions => "parent_id IS NULL AND focus = 0 AND version_id = '#{selection.version.id}'")

    unless selection.focus == nil
      @focus_rules = Connection.find(:first,
        :conditions => "name = '#{selection.focus.name}' AND version_id = '#{selection.version.id}'")
    end

    @errors = get_errors selection

    respond_to do |format|
      format.html { render :action => "ueberblick", :layout => false }
    end
  end

  private

  def get_errors selection
    errors = Array.new

    selection.semesters.each do |semester|
      count = semester.count
      semester.modules.each do |mod|
        if mod.moduledata.permission == nil
          permission = 1
        else
          permission = mod.moduledata.permission.evaluate(selection.semesters, count)
        end
        errors.push mod.moduledata unless permission == 1
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

    @name         = mod.name
    @description  = mod.description
    @short        = mod.short
    @credits      = mod.credits

    @permission = mod.permission

#    perm_con = mod.permission
#    perm_con.child_rules.each do |c|
#      c.condition
#    end

    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end

  end

  def add_module_to_selection
    selection = current_selection
    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end
    id = params[:mod_id]
    cat_id = extract_category_id(params[:cat_id])
    parent_module = Studmodule.find(id)
    my_module = SelectedModule.create(:moduledata => parent_module)
    my_module.categories = Array.new
    my_module.categories << Category.find(cat_id) unless cat_id == nil || cat_id == ""
    my_module.save
    semester.modules << my_module
    render :text => "Module added successfully..."
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
      cat_id.each { |c| my_module.categories << Category.find(extract_category_id(c)) }
    elsif cat_id.class == String
      my_module.categories << Category.find(extract_category_id(cat_id))
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
      if m.moduledata.id == id
        m.has_grade = false
        return true
      end
    end
    return false
  end

  def add_grade
    id = params[:mod_id]
    selection = current_selection
    selection.selection_modules.each do |m|
      if m.moduledata.id == id
        m.has_grade = true
        return true
      end
    end
    return false
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

    id = params[:id]

    regel = Connection.find(:first, :conditions => "id = '#{id}'")

    mods = current_selection.selection_modules

    ff = regel.evaluate mods

    ff == 1 ? @fullfilled_string = "erfüllt" : @fullfilled_string = "nicht erfüllt"
    ff == 1 ? @fullfilled = true : @fullfilled = false

    @credits_earned = regel.credits_earned mods
    @credits_needed = regel.credits_needed

    @modules_earned = regel.modules_earned mods
    @modules_needed = regel.modules_needed

    @modules = regel.collect_unique_modules_from_children_without_custom

    @available_modules = Array.new

    @modules.each do |m|
      found = false
      mods.each { |mod| found = true if mod.moduledata.id == m.id }
      @available_modules.push m unless found
    end

    @directory_string

    respond_to do |format|
      format.html { render :action => "info", :layout => false }
    end

  end

  def change_credits
    credits = params[:credits]
    mod_id = params[:mod_id]

    selection = current_selection

    selection.selection_modules.each do |m|
      if m.moduledata.id == mod_id
        m.credits = credits
        m.save
        return true
      end
    end
    return false
  end

  def remove_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.each do |m|
      if m.moduledata.id == mod_id
        m.moduledata.permission = nil
        m.save
        return true
      end
    end
    return false
  end

  def add_warning
    mod_id = params[:mod_id]
    selection = current_selection

    selection.each do |m|
      if m.moduledata.id == mod_id
        m.moduledata.permission = Studmodule.find(mod_id).permission
        m.save
        return true
      end
    end

    return false
  end

end
