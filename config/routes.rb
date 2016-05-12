Rails.application.routes.draw do



  root :to => 'pages#home'

  get '/users/edit' => 'users#edit'
  resources :users, :only => [:new, :create, :index, :update, :show]

  get '/signup' => 'users#new'

  get '/login' => 'session#new'
  post 'login' => 'session#create'

  delete '/logout' => 'session#destroy'



  get 'dance' => 'pages#dance'
  get 'dj' => 'pages#dj'
  get 'drums' => 'pages#drums'
  get 'cubes' => 'pages#cubes'
  get 'piano' => 'pages#piano'
  get 'snapshot' => 'pages#snapshot'


end
