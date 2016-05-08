Rails.application.routes.draw do
  root :to => 'pages#home'

  get 'dance-2d' => 'pages#dance-2d'
  get 'play' => 'pages#play'


end
