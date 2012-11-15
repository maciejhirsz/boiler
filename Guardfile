# A sample Guardfile
# More info at https://github.com/guard/guard#readme

guard 'coffeescript', :all_on_start => true, :bare => true, :input => 'source/client',:output => 'package/public/assets/js'
guard 'coffeescript', :all_on_start => true, :bare => true, :input => 'source/server',:output => 'package/server'

guard 'less', :all_on_start => true, :all_after_change => TRUE, :output => 'package/public/assets/css' do
 watch(%r{^source/less/.+\.less$})
end
