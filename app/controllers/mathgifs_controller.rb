require "base64"

class MathgifsController < ApplicationController
  protect_from_forgery except: :new

  def index
  end

  def new
    gif = params[:gif][22..-1]
    gif.gsub! ' ', '+'
    gif_num = Setting.gif
    path = "public/gifs/#{gif_num}.gif"

    File.open(path, "wb") do |f|
      f.write(Base64.decode64(gif))
    end

    Setting.gif += 1

    render text: gif_num
  end
end
