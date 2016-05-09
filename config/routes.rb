Rails.application.routes.draw do


  root :to => 'pages#home'

  get 'dance-2d' => 'pages#dance-2d'
  get 'play' => 'pages#play'
  get 'sounds-3d' => 'pages#sounds-3d'
  get 'instrument' => 'pages#instrument'


end
