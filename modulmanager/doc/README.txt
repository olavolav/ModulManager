What really did annoy me with Rails was the lack of default support for has_many and has_and_belongs_to_many (habtm) relations in the gui.
The usual solution is to use a select-box with the option multiple => true (with a kind of awkward syntax). But if you have more than just a handful of options, say more than 10, this really becomes unhandy. You need to option-click (Ctrl on Windows) to select more than one option. Hardly any ordinary user gets this the first time.
If you have to scroll down a long list you never see the already selected options or if you incidentally deselected the other options (which always happens to me).
A more intuitive solution (which exists in other gui frameworks) is to present two select boxes, one for all available options and one for the selected options, and the opportunity to move options from one select box to the other. I call this control a SwapSelect and built this so you can use this for any Rails project. Right now this is not a plugin, you have to copy some files manually. But it is really easy (description below).

The statement in the view file is:

<%= swapselect :product,
  @product,
  :breeds,
  Breed.all.map{ |breed| [breed.name, breed.id] } %>

Easy, hm? The method signature is:

swapselect( object_name,
  object,
  method,
  choices,
  params = {:size => 6})

* object_name: the name of the object in the view
* object: the object itself (could be retrieved by name, but somehow I find this more transparent)
* method: the method of object that gets the collection of the selected items
* choices: a collection of items that give all the possible items. Accepts a container (hash, array, enumerable, your type) and is used to create the option tags for the two select boxes. Given a container where the elements respond to first and last (such as a two-element array), the “lasts” serve as option values and the “firsts” as option text.
* params: right now only the :size of the select boxes can be set.

What this basically does is creating an appropriate javascript call, which dynamically builds the select boxes and some hidden fields to hold and submit the values (Big thanks to my colleague Sönke who did most of the job!)

It’s easier to try it out, than to explain! It takes just 2 minutes.

To use the SwapSelect in your project, do the following:

* Download the Source-Files
* Unzip it
* Copy the following files/folders to the according locations
  - RAILS_ROOT/public/javascripts/swapselect
  - RAILS_ROOT/public/images/swapselect
  - RAILS_ROOT/public/stylesheets/swapselect.css
  - RAILS_ROOT/app/helpers/swapselect_helper.rb
* include the javascript and css file to your layout file, e.g. RAILS_ROOT/app/views/layouts/application.html.erb
* you may edit the CSS file to match your layout
* make sure in RAILS_ROOT/app/controllers/application.rb to include all helpers (helper :all) which should be the default or explicitly include the swapselect_helper
* call swapselect instead of select as described above
* Have fun!

Still to do:
* build a nonscript alternative (in the “old” Rails way with just one select box) for users with javascript disabled. Are there any?
* add some more options to influence the look of the select boxes, most important: the texts.
* any ideas?

