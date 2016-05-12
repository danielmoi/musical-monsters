class PagesController < ApplicationController
  def home
  end

  def drums
    if @current_user.nil?
      flash[:error] = 'You must be logged in to see Drum Monster'
      redirect_to login_path
    end
  end

  def piano

  end

  def dj
    if @current_user.nil?
      flash[:error] = 'You must be logged in to see DJ Monster'
      redirect_to login_path
    end
  end

  def dance

  end

  def snapshot

  end

  def cubes

  end
end
