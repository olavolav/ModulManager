class Category < ActiveRecord::Base
  belongs_to :category, { :foreign_key => "category_id" }
  has_many :cildren, { :foreign_key => "category_id" }
end
