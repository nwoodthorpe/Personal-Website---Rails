require 'test_helper'

class PageControllerTest < ActionController::TestCase
  test "index should render index success" do
    get :index
    assert_response :success
  end

  test "cbc should render cbc success" do
    get :cbc
    assert_response :success
  end
end
